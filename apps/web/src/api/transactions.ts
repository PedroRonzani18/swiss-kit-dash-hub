import type {
  CreateTransactionInput,
  TransactionResource,
  UpdateTransactionInput,
} from '@/types/finance';
import { apiClient } from './client';

export async function listTransactions(): Promise<TransactionResource[]> {
  return apiClient.get<TransactionResource[]>('/transactions');
}

export async function createTransaction(
  input: CreateTransactionInput,
): Promise<TransactionResource> {
  return apiClient.post<TransactionResource, CreateTransactionInput>(
    '/transactions',
    input,
  );
}

export async function updateTransaction(
  id: string,
  input: UpdateTransactionInput,
): Promise<TransactionResource> {
  return apiClient.patch<TransactionResource, UpdateTransactionInput>(
    `/transactions/${id}`,
    input,
  );
}

export async function deleteTransaction(id: string): Promise<void> {
  return apiClient.delete(`/transactions/${id}`);
}
