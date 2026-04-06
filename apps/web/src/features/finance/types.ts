import type { Transaction } from '@/types/finance';

export type TransactionDraft = Omit<Transaction, 'id' | 'accountName'>;
