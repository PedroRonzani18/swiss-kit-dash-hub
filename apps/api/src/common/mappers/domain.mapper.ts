import {
  AUTH_PROVIDER,
  type AccountType,
  type AuthProvider,
  type TransactionType,
} from '@/common/enums';
import type {
  AccountContract,
  AuthenticatedUserContract,
  CategoryContract,
  SubcategoryContract,
  TransactionContract,
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

type AccountPersistence = {
  id: string;
  userId: string;
  name: string;
  type: AccountType;
  currency: string;
  openingBalanceCents: number;
  institution: string | null;
  isArchived: boolean;
  archivedAt: PersistenceDate | null;
  createdAt: PersistenceDate;
  updatedAt: PersistenceDate;
};

type CategoryPersistence = {
  id: string;
  userId: string;
  name: string;
  type: TransactionType;
  isArchived: boolean;
  createdAt: PersistenceDate;
  updatedAt: PersistenceDate;
};

type SubcategoryPersistence = {
  id: string;
  userId: string;
  categoryId: string;
  name: string;
  isArchived: boolean;
  createdAt: PersistenceDate;
  updatedAt: PersistenceDate;
};

type TransactionPersistence = {
  id: string;
  userId: string;
  accountId: string;
  categoryId: string;
  subcategoryId: string | null;
  type: TransactionType;
  amountCents: number;
  note: string | null;
  isInstallment: boolean;
  installmentNumber: number | null;
  installmentTotal: number | null;
  installmentGroupId: string | null;
  occurredAt: PersistenceDate;
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

export function mapAccountFromPersistence(
  row: AccountPersistence,
): AccountContract {
  return {
    id: row.id,
    userId: row.userId,
    name: row.name,
    type: row.type,
    currency: row.currency,
    openingBalanceCents: row.openingBalanceCents,
    institution: row.institution,
    isArchived: row.isArchived,
    archivedAt: toIsoDate(row.archivedAt),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function mapCategoryFromPersistence(
  row: CategoryPersistence,
): CategoryContract {
  return {
    id: row.id,
    userId: row.userId,
    name: row.name,
    type: row.type,
    isArchived: row.isArchived,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function mapSubcategoryFromPersistence(
  row: SubcategoryPersistence,
): SubcategoryContract {
  return {
    id: row.id,
    userId: row.userId,
    categoryId: row.categoryId,
    name: row.name,
    isArchived: row.isArchived,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function mapTransactionFromPersistence(
  row: TransactionPersistence,
): TransactionContract {
  return {
    id: row.id,
    userId: row.userId,
    accountId: row.accountId,
    categoryId: row.categoryId,
    subcategoryId: row.subcategoryId,
    type: row.type,
    amountCents: row.amountCents,
    note: row.note,
    isInstallment: row.isInstallment,
    installmentNumber: row.installmentNumber,
    installmentTotal: row.installmentTotal,
    installmentGroupId: row.installmentGroupId,
    occurredAt: row.occurredAt.toISOString(),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export const DEFAULT_AUTH_PROVIDER = AUTH_PROVIDER.GOOGLE;
