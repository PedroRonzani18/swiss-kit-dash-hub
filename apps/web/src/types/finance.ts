import type { AccountType, TransactionType } from '@swisskit/contracts';

export type { AccountType, TransactionType } from '@swisskit/contracts';

export type Account = {
  id: string;
  userId: string;
  name: string;
  type: AccountType;
  currency: string;
  openingBalanceCents: number;
  institution: string | null;
  isArchived: boolean;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AccountOption = {
  id: string;
  label: string;
};

export type CategoryBase = {
  id: string;
  userId: string;
  name: string;
  type: TransactionType;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Subcategory = {
  id: string;
  userId: string;
  categoryId: string;
  name: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Category = CategoryBase & {
  subcategories: Subcategory[];
};

export type Transaction = {
  id: string;
  accountId: string;
  accountName: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  subcategoryId: string;
};

export type TransactionResource = {
  id: string;
  userId: string;
  accountId: string;
  categoryId: string;
  subcategoryId: string | null;
  type: TransactionType;
  amountCents: number;
  note: string | null;
  occurredAt: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateAccountInput = {
  name: string;
  type: AccountType;
  currency?: string;
  openingBalanceCents?: number;
  institution?: string;
};

export type UpdateAccountInput = Partial<CreateAccountInput> & {
  institution?: string | null;
  isArchived?: boolean;
};

export type CreateCategoryInput = {
  name: string;
  type: TransactionType;
};

export type UpdateCategoryInput = {
  name?: string;
  type?: TransactionType;
  isArchived?: boolean;
};

export type CreateSubcategoryInput = {
  categoryId: string;
  name: string;
};

export type UpdateSubcategoryInput = {
  categoryId?: string;
  name?: string;
  isArchived?: boolean;
};

export type CreateTransactionInput = {
  type: TransactionType;
  amountCents: number;
  accountId: string;
  categoryId: string;
  subcategoryId?: string | null;
  occurredAt: string;
  note?: string;
};

export type UpdateTransactionInput = {
  type?: TransactionType;
  amountCents?: number;
  accountId?: string;
  categoryId?: string;
  subcategoryId?: string | null;
  occurredAt?: string;
  note?: string | null;
};
