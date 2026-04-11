import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';
import type { AuthUser } from '@/types/auth';
import { useGoogleLogin } from '@/features/auth/hooks/useGoogleLogin';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';
import { useLogout } from '@/features/auth/hooks/useLogout';

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
  const { loginWithGoogle, isLoading: isGoogleLoginLoading } = useGoogleLogin();
  const { logout, isLoading: isLogoutLoading } = useLogout();

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading: isSessionLoading || isGoogleLoginLoading || isLogoutLoading,
      loginWithGoogle,
      logout,
    }),
    [
      user,
      isSessionLoading,
      isGoogleLoginLoading,
      isLogoutLoading,
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
