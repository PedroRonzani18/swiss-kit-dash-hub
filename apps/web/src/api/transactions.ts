import {
  transactionResourceListSchema,
  transactionResourceSchema,
  type TransactionResourceContract,
} from '@swisskit/contracts';
import type {
  CreateTransactionInput,
  UpdateTransactionInput,
} from '@/types/finance';
import { apiClient } from './client';
import { parseApiResponse } from './validation';

export async function listTransactions(): Promise<TransactionResourceContract[]> {
  const data = await apiClient.get<unknown>('/transactions');
  return parseApiResponse(transactionResourceListSchema, data);
}

export async function createTransaction(
  input: CreateTransactionInput,
): Promise<TransactionResourceContract> {
  const data = await apiClient.post<unknown, CreateTransactionInput>(
    '/transactions',
    input,
  );
  return parseApiResponse(transactionResourceSchema, data);
}

export async function updateTransaction(
  id: string,
  input: UpdateTransactionInput,
): Promise<TransactionResourceContract> {
  const data = await apiClient.patch<unknown, UpdateTransactionInput>(
    `/transactions/${id}`,
    input,
  );
  return parseApiResponse(transactionResourceSchema, data);
}

export async function deleteTransaction(id: string): Promise<void> {
  return apiClient.delete(`/transactions/${id}`);
}
