import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';
import type { AuthUser } from '@/types/auth';
import { useAuthActions } from '@/features/auth/hooks/useAuthActions';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: isSessionLoading } = useAuthSession();
  const { loginWithGoogle, logout, isLoading: isAuthActionLoading } =
    useAuthActions();

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading: isSessionLoading || isAuthActionLoading,
      loginWithGoogle,
      logout,
    }),
    [user, isSessionLoading, isAuthActionLoading, loginWithGoogle, logout],
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
