import type {
  AuthSession,
  AuthCallbackResponse,
  AuthPopupMessage,
  UserProfile,
} from '@/types/auth';
import { API_BASE_URL, apiClient, apiRequest } from './client';

export function getGoogleAuthUrl(): string {
  return `${API_BASE_URL}/auth/google`;
}

export async function getMe(): Promise<UserProfile> {
  return apiClient.get<UserProfile>('/auth/me');
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

export function toAuthSession(payload: AuthCallbackResponse): AuthSession {
  const { success: _success, ...session } = payload;
  return session;
}
