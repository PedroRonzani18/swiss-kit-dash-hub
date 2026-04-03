import type { AccountType, AuthProvider, TransactionType } from '@/common/enums';

export type EntityId = string;
export type IsoDateString = string;

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

export type AuthSessionContract = {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: string;
  user: AuthenticatedUserContract;
};

export type AccountTypeContract = AccountType;

export type AccountContract = BaseDomainContract & {
  userId: EntityId;
  name: string;
  type: AccountType;
  currency: string;
  openingBalanceCents: number;
  institution: string | null;
  isArchived: boolean;
  archivedAt: IsoDateString | null;
};

export type CreateAccountContract = {
  userId: EntityId;
  name: string;
  type: AccountType;
  currency?: string;
  openingBalanceCents?: number;
  institution?: string;
};

export type UpdateAccountContract = {
  name?: string;
  type?: AccountType;
  currency?: string;
  openingBalanceCents?: number;
  institution?: string | null;
  isArchived?: boolean;
};

export type CategoryContract = BaseDomainContract & {
  userId: EntityId;
  name: string;
  type: TransactionType;
  isArchived: boolean;
};

export type CreateCategoryContract = {
  userId: EntityId;
  name: string;
  type: TransactionType;
};

export type UpdateCategoryContract = {
  name?: string;
  type?: TransactionType;
  isArchived?: boolean;
};

export type SubcategoryContract = BaseDomainContract & {
  userId: EntityId;
  categoryId: EntityId;
  name: string;
  isArchived: boolean;
};

export type CreateSubcategoryContract = {
  userId: EntityId;
  categoryId: EntityId;
  name: string;
};

export type UpdateSubcategoryContract = {
  categoryId?: EntityId;
  name?: string;
  isArchived?: boolean;
};

export type TransactionTypeContract = TransactionType;

export type TransactionContract = BaseDomainContract & {
  userId: EntityId;
  accountId: EntityId;
  categoryId: EntityId;
  subcategoryId: EntityId | null;
  type: TransactionType;
  amountCents: number;
  note: string | null;
  occurredAt: IsoDateString;
};

export type CreateTransactionContract = {
  userId: EntityId;
  accountId: EntityId;
  categoryId: EntityId;
  subcategoryId?: EntityId | null;
  type: TransactionType;
  amountCents: number;
  note?: string;
  occurredAt: IsoDateString;
};

export type UpdateTransactionContract = {
  accountId?: EntityId;
  categoryId?: EntityId;
  subcategoryId?: EntityId | null;
  type?: TransactionType;
  amountCents?: number;
  note?: string | null;
  occurredAt?: IsoDateString;
};
