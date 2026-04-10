import type { Transaction } from '@/types/finance';

export type MutationResult = 'duplicate' | 'success';

export type TransactionDraft = Omit<Transaction, 'id' | 'accountName'>;
