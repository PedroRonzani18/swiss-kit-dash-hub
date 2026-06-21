import type { AccountType, TransactionType } from './enums';
import type {
  AccountContract,
  CategoryContract,
  SubcategoryContract,
  TransactionContract,
} from './contracts';

type PersistenceDate = Date;

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
