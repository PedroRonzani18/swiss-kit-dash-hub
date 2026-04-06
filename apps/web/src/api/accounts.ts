import {
  accountSchema,
  accountListSchema,
  type AccountContract,
} from '@swisskit/contracts';
import type { CreateAccountInput, UpdateAccountInput } from '@/types/finance';
import { apiClient } from './client';
import { parseApiResponse } from './validation';

export async function listAccounts(): Promise<AccountContract[]> {
  const data = await apiClient.get<unknown>('/accounts');
  return parseApiResponse(accountListSchema, data);
}

export async function createAccount(input: CreateAccountInput): Promise<AccountContract> {
  const data = await apiClient.post<unknown, CreateAccountInput>('/accounts', input);
  return parseApiResponse(accountSchema, data);
}

export async function updateAccount(
  id: string,
  input: UpdateAccountInput,
): Promise<AccountContract> {
  const data = await apiClient.patch<unknown, UpdateAccountInput>(`/accounts/${id}`, input);
  return parseApiResponse(accountSchema, data);
}

export async function deleteAccount(id: string): Promise<void> {
  return apiClient.delete(`/accounts/${id}`);
}
