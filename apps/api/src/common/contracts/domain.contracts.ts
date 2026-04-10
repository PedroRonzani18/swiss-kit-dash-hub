import type {
  AccountContract as SharedAccountContract,
  AccountType,
  AuthProvider,
  CategoryContract as SharedCategoryContract,
  CreateAccountInputContract,
  CreateCategoryInputContract,
  CreateSubcategoryInputContract,
  CreateTransactionInputContract,
  EntityId,
  IsoDateString,
  SubcategoryContract as SharedSubcategoryContract,
  TransactionContract as SharedTransactionContract,
  TransactionType,
  UpdateAccountInputContract,
  UpdateCategoryInputContract,
  UpdateSubcategoryInputContract,
  UpdateTransactionInputContract,
} from '@swisskit/contracts';

export type { EntityId, IsoDateString };

export type BaseDomainContract = {
  id: EntityId;
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
};

export type UserContract = BaseDomainContract & {
  email: string;
  name: string | null;
  avatarUrl: string | null;
  provider: AuthProvider;
  providerUserId: string;
  lastLoginAt: IsoDateString | null;
};

export type AuthenticatedUserContract = {
  id: EntityId;
  email: string;
  name: string | null;
  provider: AuthProvider;
};

export type GoogleAuthProfileContract = {
  email: string;
  name: string | null;
  avatarUrl: string | null;
  providerUserId: string;
};

export type JwtPayloadContract = {
  sub: EntityId;
  email: string;
  name: string | null;
  provider: AuthProvider;
};

export type AuthLoginResultContract = {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: string;
  user: AuthenticatedUserContract;
};

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

export type CreateTransactionContract = CreateTransactionInputContract & {
  userId: EntityId;
};
export type UpdateTransactionContract = UpdateTransactionInputContract;
