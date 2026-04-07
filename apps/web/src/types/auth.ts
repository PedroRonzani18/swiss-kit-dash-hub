import type { AuthProvider } from '@swisskit/contracts';

export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
  provider: AuthProvider;
};

export type UserProfile = AuthUser & {
  avatarUrl: string | null;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AuthSession = {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: string;
  user: AuthUser;
};

export type AuthCallbackResponse = AuthSession & {
  success: true;
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
