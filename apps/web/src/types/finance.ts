import type {
  AccountContract,
  AccountType,
  CategoryContract,
  CreateAccountInputContract,
  CreateCategoryInputContract,
  CreateSubcategoryInputContract,
  CreateTransactionInputContract,
  SubcategoryContract,
  TransactionContract,
  TransactionType,
  UpdateAccountInputContract,
  UpdateCategoryInputContract,
  UpdateSubcategoryInputContract,
  UpdateTransactionInputContract,
} from '@swisskit/contracts';

export type { AccountType, TransactionType };

export type Account = AccountContract;

export type AccountOption = {
  id: string;
  label: string;
};

export type CategoryBase = CategoryContract;
export type Subcategory = SubcategoryContract;

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
  isInstallment: boolean;
  installmentNumber: number | null;
  installmentTotal: number | null;
  installmentGroupId: string | null;
};

export type TransactionResource = TransactionContract;

export type CreateAccountInput = CreateAccountInputContract;
export type UpdateAccountInput = UpdateAccountInputContract;
export type CreateCategoryInput = CreateCategoryInputContract;
export type UpdateCategoryInput = UpdateCategoryInputContract;
export type CreateSubcategoryInput = CreateSubcategoryInputContract;
export type UpdateSubcategoryInput = UpdateSubcategoryInputContract;
export type CreateTransactionInput = CreateTransactionInputContract;
export type UpdateTransactionInput = UpdateTransactionInputContract;
