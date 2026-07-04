import {
  AllowedEmailsOverviewSchema,
  type AllowedEmailsOverviewContract,
} from '@swisskit/contracts/allowed-emails';
import { apiClient } from './client';

export async function getAllowedEmailsOverview(): Promise<AllowedEmailsOverviewContract> {
  const payload = await apiClient.get<unknown>('/allowed-emails');

  return AllowedEmailsOverviewSchema.parse(payload);
}
