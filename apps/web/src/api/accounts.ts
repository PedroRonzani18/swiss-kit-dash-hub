import {
  accountSchema,
  accountListSchema,
} from '@swisskit/contracts';
import type { Account, CreateAccountInput, UpdateAccountInput } from '@/types/finance';
import { apiClient } from './client';
import { parseApiResponse } from './validation';

export async function listAccounts(): Promise<Account[]> {
  const data = await apiClient.get<unknown>('/accounts');
  return parseApiResponse(accountListSchema, data) as Account[];
}

export async function createAccount(input: CreateAccountInput): Promise<Account> {
  const data = await apiClient.post<unknown, CreateAccountInput>('/accounts', input);
  return parseApiResponse(accountSchema, data) as Account;
}

export async function updateAccount(
  id: string,
  input: UpdateAccountInput,
): Promise<Account> {
  const data = await apiClient.patch<unknown, UpdateAccountInput>(`/accounts/${id}`, input);
  return parseApiResponse(accountSchema, data) as Account;
}

export async function deleteAccount(id: string): Promise<void> {
  return apiClient.delete(`/accounts/${id}`);
}
