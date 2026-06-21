import { AUTH_PROVIDER, type AuthProvider } from '@/common/enums';
import type {
  AuthenticatedUserContract,
  UserContract,
} from '@/common/contracts';

type PersistenceDate = Date;

type UserPersistence = {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  provider: AuthProvider;
  providerUserId: string;
  lastLoginAt: PersistenceDate | null;
  createdAt: PersistenceDate;
  updatedAt: PersistenceDate;
};

function toIsoDate(value: Date | null): string | null {
  return value ? value.toISOString() : null;
}

export function mapUserFromPersistence(row: UserPersistence): UserContract {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    avatarUrl: row.avatarUrl,
    provider: row.provider,
    providerUserId: row.providerUserId,
    lastLoginAt: toIsoDate(row.lastLoginAt),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function mapAuthenticatedUser(
  user: UserContract,
): AuthenticatedUserContract {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    provider: user.provider,
  };
}

export const DEFAULT_AUTH_PROVIDER = AUTH_PROVIDER.GOOGLE;
