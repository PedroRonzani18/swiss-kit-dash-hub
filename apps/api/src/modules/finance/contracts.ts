import type {
  AccountContract as SharedAccountContract,
  AccountType,
  CategoryContract as SharedCategoryContract,
  CreateAccountInputContract,
  CreateCategoryInputContract,
  CreateSubcategoryInputContract,
  CreateTransactionInputContract,
  SubcategoryContract as SharedSubcategoryContract,
  TransactionContract as SharedTransactionContract,
  TransactionType,
  UpdateAccountInputContract,
  UpdateCategoryInputContract,
  UpdateSubcategoryInputContract,
  UpdateTransactionInputContract,
} from '@swisskit/contracts';
import type { EntityId } from '@swisskit/contracts/core';

export type AccountTypeContract = AccountType;

export type AccountContract = SharedAccountContract;
export type CategoryContract = SharedCategoryContract;
export type SubcategoryContract = SharedSubcategoryContract;
export type TransactionContract = SharedTransactionContract;

export type CreateAccountContract = CreateAccountInputContract & {
  userId: EntityId;
};
export type UpdateAccountContract = UpdateAccountInputContract;

export type CreateCategoryContract = CreateCategoryInputContract & {
  userId: EntityId;
};
export type UpdateCategoryContract = UpdateCategoryInputContract;

export type CreateSubcategoryContract = CreateSubcategoryInputContract & {
  userId: EntityId;
};
export type UpdateSubcategoryContract = UpdateSubcategoryInputContract;

export type TransactionTypeContract = TransactionType;

export type CreateTransactionContract = Omit<
  CreateTransactionInputContract,
  'installmentEnabled' | 'installmentCount'
> & {
  userId: EntityId;
  isInstallment?: boolean;
  installmentNumber?: number | null;
  installmentTotal?: number | null;
  installmentGroupId?: string | null;
};
export type UpdateTransactionContract = UpdateTransactionInputContract;
