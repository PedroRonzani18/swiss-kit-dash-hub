import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';
import type { PermissionKeyContract } from '@swisskit/contracts/permissions';
import type { AuthUser } from '@/types/auth';
import { useAuthSession, useGoogleLogin, useLogout } from '@/features/auth';

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  permissions: PermissionKeyContract[];
  roles: string[];
  can: (permission: PermissionKeyContract) => boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: isSessionLoading } = useAuthSession();
  const { loginWithGoogle, isLoading: isGoogleLoginLoading } = useGoogleLogin();
  const { logout, isLoading: isLogoutLoading } = useLogout();

  const permissions = user?.permissions ?? [];
  const roles = user?.roles ?? [];

  const can = useCallback(
    (permission: PermissionKeyContract) => permissions.includes(permission),
    [permissions],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading: isSessionLoading || isGoogleLoginLoading || isLogoutLoading,
      permissions,
      roles,
      can,
      loginWithGoogle,
      logout,
    }),
    [
      user,
      isSessionLoading,
      isGoogleLoginLoading,
      isLogoutLoading,
      permissions,
      roles,
      can,
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
