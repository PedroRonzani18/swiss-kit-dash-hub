import type {
  AccountType,
  AuthProvider,
  TransactionType,
} from '@swisskit/contracts';

export const ACCOUNT_TYPE = {
  CHECKING: 'checking',
  SAVINGS: 'savings',
  CREDIT_CARD: 'credit_card',
  CASH: 'cash',
} as const;

export const TRANSACTION_TYPE = {
  INCOME: 'income',
  EXPENSE: 'expense',
} as const;

export const AUTH_PROVIDER = {
  GOOGLE: 'google',
} as const;

export type { AccountType, TransactionType, AuthProvider };
