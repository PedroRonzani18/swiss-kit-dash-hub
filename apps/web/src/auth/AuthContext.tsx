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
import {
  getMe,
  getGoogleAuthUrl,
  logout as logoutRequest,
  parseAuthPopupFromText,
} from '@/api/auth';
import { getApiOrigin } from '@/api/client';
import { authKeys, financeKeys } from '@/api/queryKeys';
import type {
  AuthCallbackResponse,
  AuthPopupMessage,
  AuthUser,
} from '@/types/auth';

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function isAuthPopupMessage(payload: unknown): payload is AuthPopupMessage {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'type' in payload &&
    typeof payload.type === 'string'
  );
}

function isAuthCallbackResponse(payload: unknown): payload is AuthCallbackResponse {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'success' in payload &&
    payload.success === true
  );
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
  const [isAuthActionLoading, setIsAuthActionLoading] = useState(false);

  const meQuery = useQuery({
    queryKey: authKeys.me(),
    queryFn: getMe,
    retry: false,
    staleTime: 0,
  });

  useEffect(() => {
    if (meQuery.isError) {
      queryClient.removeQueries({ queryKey: financeKeys.root });
    }
  }, [meQuery.isError, queryClient]);

  const syncSessionFromApi = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: authKeys.me() });
    await queryClient.fetchQuery({
      queryKey: authKeys.me(),
      queryFn: getMe,
      staleTime: 0,
    });
    await queryClient.invalidateQueries({ queryKey: financeKeys.root });
  }, [queryClient]);

  const loginWithGoogle = useCallback(async () => {
    setIsAuthActionLoading(true);

    try {
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

          resolve();
        };

        const messageListener = (event: MessageEvent) => {
          if (event.origin !== apiOrigin) {
            return;
          }

          const data = event.data as unknown;
          if (!isAuthPopupMessage(data)) {
            return;
          }

          if (data.type === 'swisskit:auth:error') {
            cleanup(messageListener, pollTimer, timeoutTimer);
            reject(new Error(data.payload?.message || 'Falha no login com Google'));
            return;
          }

          if (data.type === 'swisskit:auth:success') {
            onSuccess(messageListener, pollTimer, timeoutTimer);
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

            const parsed = parseAuthPopupFromText(raw);
            if (isAuthPopupMessage(parsed) && parsed.type === 'swisskit:auth:error') {
              cleanup(messageListener, pollTimer, timeoutTimer);
              reject(new Error(parsed.payload?.message || 'Falha no login com Google'));
              return;
            }

            if (
              (isAuthPopupMessage(parsed) &&
                parsed.type === 'swisskit:auth:success') ||
              isAuthCallbackResponse(parsed)
            ) {
              onSuccess(messageListener, pollTimer, timeoutTimer);
            }
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

      await syncSessionFromApi();
    } finally {
      setIsAuthActionLoading(false);
    }
  }, [syncSessionFromApi]);

  const logout = useCallback(async () => {
    setIsAuthActionLoading(true);
    try {
      await logoutRequest();
    } finally {
      queryClient.removeQueries({ queryKey: authKeys.root });
      queryClient.removeQueries({ queryKey: financeKeys.root });
      setIsAuthActionLoading(false);
    }
  }, [queryClient]);

  const user = useMemo<AuthUser | null>(() => {
    if (!meQuery.data) {
      return null;
    }

    return {
      id: meQuery.data.id,
      email: meQuery.data.email,
      name: meQuery.data.name,
      provider: meQuery.data.provider,
    };
  }, [meQuery.data]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading: meQuery.isLoading || isAuthActionLoading,
      loginWithGoogle,
      logout,
    }),
    [user, meQuery.isLoading, isAuthActionLoading, loginWithGoogle, logout],
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
