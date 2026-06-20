import type { Transaction } from '@/types/finance';

export type MutationResult = 'duplicate' | 'success';

export type TransactionDraft = {
  accountId: string;
  date: string;
  description: string;
  amount: number;
  type: Transaction['type'];
  categoryId: string;
  subcategoryId: string;
  installmentEnabled: boolean;
  installmentCount?: number;
};
