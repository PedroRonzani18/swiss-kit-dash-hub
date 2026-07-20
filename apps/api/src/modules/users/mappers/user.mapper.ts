import type { AuthProvider } from '@swisskit/contracts/core';
import type { UserProfileContract } from '@swisskit/contracts/users';

type UserPersistence = {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  isActive: boolean;
  note: string | null;
  provider: AuthProvider | null;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

function toIsoString(value: Date | null): string | null {
  return value ? value.toISOString() : null;
}

export function mapUserProfileFromPersistence(
  user: UserPersistence,
): UserProfileContract {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl,
    isActive: user.isActive,
    note: user.note,
    provider: user.provider,
    lastLoginAt: toIsoString(user.lastLoginAt),
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}
