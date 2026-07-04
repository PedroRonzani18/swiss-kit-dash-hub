import {
  SettingsOverviewSchema,
  type SettingsOverviewContract,
} from '@swisskit/contracts/settings';
import { apiClient } from './client';

export async function getSettingsOverview(): Promise<SettingsOverviewContract> {
  const payload = await apiClient.get<unknown>('/settings');

  return SettingsOverviewSchema.parse(payload);
}
