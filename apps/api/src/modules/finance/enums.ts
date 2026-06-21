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

export type AccountType = (typeof ACCOUNT_TYPE)[keyof typeof ACCOUNT_TYPE];
export type TransactionType =
  (typeof TRANSACTION_TYPE)[keyof typeof TRANSACTION_TYPE];
