import type { AuthProvider } from '@swisskit/contracts/core';
import type { PermissionKeyContract } from '@swisskit/contracts/permissions';

export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
  provider: AuthProvider;
  roles: string[];
  permissions: PermissionKeyContract[];
};

export type UserProfile = AuthUser & {
  avatarUrl: string | null;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AuthCallbackResponse = {
  success: true;
  user: Omit<AuthUser, 'roles' | 'permissions'>;
};

export type AuthPopupSuccessMessage = {
  type: 'swisskit:auth:success';
  payload?: AuthCallbackResponse;
};

export type AuthPopupErrorMessage = {
  type: 'swisskit:auth:error';
  payload?: {
    message?: string;
  };
};

export type AuthPopupMessage = AuthPopupSuccessMessage | AuthPopupErrorMessage;
