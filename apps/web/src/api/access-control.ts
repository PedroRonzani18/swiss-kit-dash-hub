import {
  AccessControlOverviewSchema,
  type AccessControlOverviewContract,
} from '@swisskit/contracts/access-control';
import { apiClient } from './client';

export async function getAccessControlOverview(): Promise<AccessControlOverviewContract> {
  return apiClient.getWithSchema('/access-control', AccessControlOverviewSchema);
}
