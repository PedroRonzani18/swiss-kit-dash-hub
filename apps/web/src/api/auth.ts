import { CurrentUserSchema } from '@swisskit/contracts/auth';
import type {
  AuthCallbackResponse,
  AuthPopupMessage,
  UserProfile,
} from '@/types/auth';
import { API_BASE_URL, apiClient, apiRequest } from './client';

export function getGoogleAuthUrl(): string {
  return `${API_BASE_URL}/auth/google`;
}

export async function getMe(): Promise<UserProfile> {
  return apiClient.getWithSchema('/auth/me', CurrentUserSchema) as Promise<UserProfile>;
}

export async function logout(): Promise<void> {
  await apiRequest<void>('/auth/logout', {
    method: 'POST',
  });
}

export function parseAuthPopupFromText(
  payload: string,
): AuthPopupMessage | AuthCallbackResponse {
  return JSON.parse(payload) as AuthPopupMessage | AuthCallbackResponse;
}
