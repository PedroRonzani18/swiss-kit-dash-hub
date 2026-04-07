import {
  transactionResourceListSchema,
  transactionResourceSchema,
} from '@swisskit/contracts';
import type {
  CreateTransactionInput,
  TransactionResource,
  UpdateTransactionInput,
} from '@/types/finance';
import { apiClient } from './client';
import { parseApiResponse } from './validation';

export async function listTransactions(): Promise<TransactionResource[]> {
  const data = await apiClient.get<unknown>('/transactions');
  return parseApiResponse(transactionResourceListSchema, data) as TransactionResource[];
}

export async function createTransaction(
  input: CreateTransactionInput,
): Promise<TransactionResource> {
  const data = await apiClient.post<unknown, CreateTransactionInput>(
    '/transactions',
    input,
  );
  return parseApiResponse(transactionResourceSchema, data) as TransactionResource;
}

export async function updateTransaction(
  id: string,
  input: UpdateTransactionInput,
): Promise<TransactionResource> {
  const data = await apiClient.patch<unknown, UpdateTransactionInput>(
    `/transactions/${id}`,
    input,
  );
  return parseApiResponse(transactionResourceSchema, data) as TransactionResource;
}

export async function deleteTransaction(id: string): Promise<void> {
  return apiClient.delete(`/transactions/${id}`);
}
