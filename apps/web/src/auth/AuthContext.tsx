import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getMe, getGoogleAuthUrl, parseAuthSessionFromText } from '@/api/auth';
import { getApiOrigin } from '@/api/client';
import { authKeys, financeKeys } from '@/api/queryKeys';
import {
  clearStoredAuthSession,
  getStoredAuthSession,
  setStoredAuthSession,
} from '@/auth/storage';
import type { AuthPopupMessage, AuthSession, AuthUser } from '@/types/auth';

type AuthContextValue = {
  session: AuthSession | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function applySession(session: AuthSession | null): void {
  if (session) {
    setStoredAuthSession(session);
    return;
  }

  clearStoredAuthSession();
}

function openGooglePopup(): Window | null {
  const popupWidth = 520;
  const popupHeight = 720;
  const left = window.screenX + (window.outerWidth - popupWidth) / 2;
  const top = window.screenY + (window.outerHeight - popupHeight) / 2;

  return window.open(
    getGoogleAuthUrl(),
    'swisskit-google-auth',
    [
      `width=${popupWidth}`,
      `height=${popupHeight}`,
      `left=${Math.max(0, left)}`,
      `top=${Math.max(0, top)}`,
      'popup=yes',
      'resizable=yes',
      'scrollbars=yes',
    ].join(','),
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [session, setSession] = useState<AuthSession | null>(() => getStoredAuthSession());

  const meQuery = useQuery({
    queryKey: authKeys.me(),
    queryFn: getMe,
    enabled: Boolean(session?.accessToken),
    retry: false,
  });

  useEffect(() => {
    if (meQuery.isError) {
      setSession(null);
      applySession(null);
      queryClient.removeQueries({ queryKey: financeKeys.root });
    }
  }, [meQuery.isError, queryClient]);

  const loginWithGoogle = useCallback(async () => {
    const popup = openGooglePopup();

    if (!popup) {
      window.location.href = getGoogleAuthUrl();
      return;
    }

    await new Promise<void>((resolve, reject) => {
      const apiOrigin = getApiOrigin();
      const timeoutMs = 3 * 60 * 1000;
      const startedAt = Date.now();

      const cleanup = (
        messageListener: (event: MessageEvent) => void,
        pollTimer: number,
        timeoutTimer: number,
      ) => {
        window.removeEventListener('message', messageListener);
        window.clearInterval(pollTimer);
        window.clearTimeout(timeoutTimer);
      };

      const onSuccess = (
        nextSession: AuthSession,
        messageListener: (event: MessageEvent) => void,
        pollTimer: number,
        timeoutTimer: number,
      ) => {
        cleanup(messageListener, pollTimer, timeoutTimer);
        try {
          popup.close();
        } catch {
          // noop
        }

        setSession(nextSession);
        applySession(nextSession);
        queryClient.invalidateQueries({ queryKey: authKeys.me() });
        queryClient.invalidateQueries({ queryKey: financeKeys.root });
        resolve();
      };

      const messageListener = (event: MessageEvent) => {
        if (event.origin !== apiOrigin) {
          return;
        }

        const data = event.data as AuthPopupMessage | undefined;
        if (!data || typeof data !== 'object' || !('type' in data)) {
          return;
        }

        if (data.type === 'swisskit:auth:error') {
          cleanup(messageListener, pollTimer, timeoutTimer);
          reject(new Error(data.payload?.message || 'Falha no login com Google'));
          return;
        }

        if (data.type === 'swisskit:auth:success') {
          onSuccess(data.payload, messageListener, pollTimer, timeoutTimer);
        }
      };

      const pollTimer = window.setInterval(() => {
        if (popup.closed) {
          cleanup(messageListener, pollTimer, timeoutTimer);
          reject(new Error('Login cancelado antes da conclusão.'));
          return;
        }

        // Fallback for environments where callback returns JSON in same origin (proxy/local).
        try {
          const href = popup.location.href;
          if (!href.includes('/auth/google/callback')) {
            return;
          }

          const raw = popup.document.body?.innerText?.trim();
          if (!raw || !raw.startsWith('{')) {
            return;
          }

          const parsed = parseAuthSessionFromText(raw);
          onSuccess(parsed, messageListener, pollTimer, timeoutTimer);
        } catch {
          // Ignore cross-origin read errors until callback page becomes readable.
        }
      }, 400);

      const timeoutTimer = window.setTimeout(() => {
        cleanup(messageListener, pollTimer, timeoutTimer);
        reject(new Error('Tempo limite excedido durante autenticação.'));
      }, timeoutMs - (Date.now() - startedAt));

      window.addEventListener('message', messageListener);
    });
  }, [queryClient]);

  const logout = useCallback(() => {
    setSession(null);
    applySession(null);
    queryClient.removeQueries({ queryKey: authKeys.root });
    queryClient.removeQueries({ queryKey: financeKeys.root });
  }, [queryClient]);

  const user = meQuery.data
    ? {
        id: meQuery.data.id,
        email: meQuery.data.email,
        name: meQuery.data.name,
        provider: meQuery.data.provider,
      }
    : session?.user ?? null;

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user,
      isAuthenticated: Boolean(session && user),
      isLoading: Boolean(session) && meQuery.isLoading,
      loginWithGoogle,
      logout,
    }),
    [session, user, meQuery.isLoading, loginWithGoogle, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
