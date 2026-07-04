import {
  UsersOverviewSchema,
  type UsersOverviewContract,
} from '@swisskit/contracts/users';
import { apiClient } from './client';

export async function getUsersOverview(): Promise<UsersOverviewContract> {
  const payload = await apiClient.get<unknown>('/users');

  return UsersOverviewSchema.parse(payload);
}
