import type { AuthSession, UserProfile } from '@/types/auth';
import { API_BASE_URL, apiClient } from './client';

export function getGoogleAuthUrl(): string {
  return `${API_BASE_URL}/auth/google`;
}

export async function getMe(): Promise<UserProfile> {
  return apiClient.get<UserProfile>('/auth/me');
}

export function parseAuthSessionFromText(payload: string): AuthSession {
  return JSON.parse(payload) as AuthSession;
}
