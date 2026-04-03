export type TransactionTypeContract = 'income' | 'expense';

export type TransactionContract = {
  id: string;
  userId: string;
  accountId: string;
  categoryId: string;
  subcategoryId: string | null;
  type: TransactionTypeContract;
  amountCents: number;
  note: string | null;
  occurredAt: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateTransactionContract = {
  userId: string;
  accountId: string;
  categoryId: string;
  subcategoryId?: string | null;
  type: TransactionTypeContract;
  amountCents: number;
  note?: string;
  occurredAt: string;
};

export type UpdateTransactionContract = {
  accountId?: string;
  categoryId?: string;
  subcategoryId?: string | null;
  type?: TransactionTypeContract;
  amountCents?: number;
  note?: string;
  occurredAt?: string;
};
