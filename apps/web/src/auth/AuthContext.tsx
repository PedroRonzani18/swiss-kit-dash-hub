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
  toAuthSession,
} from '@/api/auth';
import { getApiOrigin } from '@/api/client';
import { authKeys, financeKeys } from '@/api/queryKeys';
import { clearAuthSession, readAuthSession, saveAuthSession } from '@/auth/session';
import type {
  AuthCallbackResponse,
  AuthSession,
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
  if (typeof payload !== 'object' || payload === null) {
    return false;
  }

  const candidate = payload as Record<string, unknown>;
  const user = candidate.user as Record<string, unknown> | undefined;

  return (
    candidate.success === true &&
    typeof candidate.accessToken === 'string' &&
    candidate.accessToken.length > 0 &&
    candidate.tokenType === 'Bearer' &&
    typeof candidate.expiresIn === 'string' &&
    typeof user?.id === 'string' &&
    typeof user?.email === 'string' &&
    (typeof user?.name === 'string' || user?.name === null) &&
    typeof user?.provider === 'string'
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

function readAuthSessionFromHash(hash: string): AuthSession | null {
  if (!hash) {
    return null;
  }

  const params = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash);
  const authSessionParam = params.get('authSession');
  if (!authSessionParam) {
    return null;
  }

  try {
    const parsed = JSON.parse(authSessionParam) as unknown;
    if (!isAuthCallbackResponse(parsed)) {
      return null;
    }

    return toAuthSession(parsed);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [session, setSession] = useState<AuthSession | null>(() => readAuthSession());
  const [isAuthActionLoading, setIsAuthActionLoading] = useState(false);

  const clearLocalAuthState = useCallback(() => {
    clearAuthSession();
    setSession(null);
    queryClient.removeQueries({ queryKey: authKeys.root });
    queryClient.removeQueries({ queryKey: financeKeys.root });
  }, [queryClient]);

  const syncSessionFromApi = useCallback(async () => {
    try {
      await queryClient.invalidateQueries({ queryKey: authKeys.me() });
      await queryClient.fetchQuery({
        queryKey: authKeys.me(),
        queryFn: getMe,
        staleTime: 0,
      });
      await queryClient.invalidateQueries({ queryKey: financeKeys.root });
    } catch (error) {
      clearLocalAuthState();
      throw error;
    }
  }, [clearLocalAuthState, queryClient]);

  const meQuery = useQuery({
    queryKey: authKeys.me(),
    queryFn: getMe,
    enabled: Boolean(session?.accessToken),
    retry: false,
    staleTime: 0,
  });

  useEffect(() => {
    if (meQuery.isError) {
      clearLocalAuthState();
    }
  }, [clearLocalAuthState, meQuery.isError]);

  useEffect(() => {
    const authSessionFromHash = readAuthSessionFromHash(window.location.hash);
    if (!authSessionFromHash) {
      return;
    }

    saveAuthSession(authSessionFromHash);
    setSession(authSessionFromHash);
    window.history.replaceState(
      null,
      document.title,
      `${window.location.pathname}${window.location.search}`,
    );

    void syncSessionFromApi().catch(() => undefined);
  }, [syncSessionFromApi]);

  const loginWithGoogle = useCallback(async () => {
    setIsAuthActionLoading(true);

    try {
      const popup = openGooglePopup();

      if (!popup) {
        window.location.href = getGoogleAuthUrl();
        return;
      }

      const callbackResponse = await new Promise<AuthCallbackResponse | undefined>(
        (resolve, reject) => {
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
            payload?: AuthCallbackResponse,
          ) => {
            cleanup(messageListener, pollTimer, timeoutTimer);
            try {
              popup.close();
            } catch {
              // noop
            }

            resolve(payload);
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
              const payload = isAuthCallbackResponse(data.payload)
                ? data.payload
                : undefined;
              onSuccess(messageListener, pollTimer, timeoutTimer, payload);
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
                const payload = isAuthCallbackResponse(parsed)
                  ? parsed
                  : isAuthCallbackResponse(parsed.payload)
                    ? parsed.payload
                    : undefined;
                onSuccess(messageListener, pollTimer, timeoutTimer, payload);
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
        },
      );

      if (!callbackResponse) {
        throw new Error('Resposta de autenticação inválida: token ausente.');
      }

      const authSession = toAuthSession(callbackResponse);
      saveAuthSession(authSession);
      setSession(authSession);

      await syncSessionFromApi();
    } finally {
      setIsAuthActionLoading(false);
    }
  }, [syncSessionFromApi]);

  const logout = useCallback(async () => {
    setIsAuthActionLoading(true);
    let logoutError: unknown;

    try {
      await logoutRequest();
    } catch (error) {
      logoutError = error;
    } finally {
      clearLocalAuthState();
      setIsAuthActionLoading(false);
    }

    if (logoutError) {
      throw logoutError;
    }
  }, [clearLocalAuthState]);

  const user = useMemo<AuthUser | null>(() => {
    if (meQuery.data) {
      return {
        id: meQuery.data.id,
        email: meQuery.data.email,
        name: meQuery.data.name,
        provider: meQuery.data.provider,
      };
    }

    return session?.user ?? null;
  }, [meQuery.data, session?.user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(session?.accessToken),
      isLoading: meQuery.isLoading || isAuthActionLoading,
      loginWithGoogle,
      logout,
    }),
    [
      user,
      session?.accessToken,
      meQuery.isLoading,
      isAuthActionLoading,
      loginWithGoogle,
      logout,
    ],
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
