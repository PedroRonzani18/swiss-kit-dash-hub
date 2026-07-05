import {
  AccessControlOverviewSchema,
  type AccessControlOverviewContract,
} from '@swisskit/contracts/access-control';
import { apiClient } from './client';

export async function getAccessControlOverview(): Promise<AccessControlOverviewContract> {
  const payload = await apiClient.get<unknown>('/access-control');

  return AccessControlOverviewSchema.parse(payload);
}
