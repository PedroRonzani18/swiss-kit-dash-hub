import type {
  Account,
  CreateAccountInput,
  UpdateAccountInput,
} from '@/types/finance';
import { apiClient } from './client';

export async function listAccounts(): Promise<Account[]> {
  return apiClient.get<Account[]>('/accounts');
}

export async function createAccount(input: CreateAccountInput): Promise<Account> {
  return apiClient.post<Account, CreateAccountInput>('/accounts', input);
}

export async function updateAccount(
  id: string,
  input: UpdateAccountInput,
): Promise<Account> {
  return apiClient.patch<Account, UpdateAccountInput>(`/accounts/${id}`, input);
}

export async function deleteAccount(id: string): Promise<void> {
  return apiClient.delete(`/accounts/${id}`);
}
