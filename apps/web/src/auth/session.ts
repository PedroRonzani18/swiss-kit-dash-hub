import type { AuthSession } from '@/types/auth';

const AUTH_SESSION_STORAGE_KEY = 'swisskit:auth:session';

function getSessionStorage(): Storage | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.sessionStorage;
}

function isAuthSession(payload: unknown): payload is AuthSession {
  if (typeof payload !== 'object' || payload === null) {
    return false;
  }

  const candidate = payload as Record<string, unknown>;
  const user = candidate.user as Record<string, unknown> | undefined;

  return (
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

export function saveAuthSession(session: AuthSession): void {
  const storage = getSessionStorage();
  if (!storage) {
    return;
  }

  storage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function readAuthSession(): AuthSession | null {
  const storage = getSessionStorage();
  if (!storage) {
    return null;
  }

  const rawValue = storage.getItem(AUTH_SESSION_STORAGE_KEY);
  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue) as unknown;
    return isAuthSession(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function clearAuthSession(): void {
  const storage = getSessionStorage();
  if (!storage) {
    return;
  }

  storage.removeItem(AUTH_SESSION_STORAGE_KEY);
}

export function getAccessToken(): string | null {
  return readAuthSession()?.accessToken ?? null;
}

