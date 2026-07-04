import {
  AllowedEmailSchema,
  AllowedEmailsOverviewSchema,
  type AllowedEmailContract,
  type AllowedEmailsOverviewContract,
} from '@swisskit/contracts/allowed-emails';
import { apiClient } from './client';

export async function getAllowedEmailsOverview(): Promise<AllowedEmailsOverviewContract> {
  const payload = await apiClient.get<unknown>('/allowed-emails');

  return AllowedEmailsOverviewSchema.parse(payload);
}

export async function addEntry(input: {
  email: string;
  note?: string | null;
}): Promise<AllowedEmailContract> {
  const payload = await apiClient.post<unknown, typeof input>(
    '/allowed-emails',
    input,
  );

  return AllowedEmailSchema.parse(payload);
}

export async function setEntryStatus(
  id: string,
  input: { isActive: boolean },
): Promise<AllowedEmailContract> {
  const payload = await apiClient.patch<unknown, typeof input>(
    `/allowed-emails/${id}/status`,
    input,
  );

  return AllowedEmailSchema.parse(payload);
}
