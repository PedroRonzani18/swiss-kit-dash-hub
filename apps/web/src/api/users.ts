import {
  CreateUserInputSchema,
  UpdateUserStatusInputSchema,
  UserProfileSchema,
  UsersOverviewSchema,
  type CreateUserInputContract,
  type UpdateUserStatusInputContract,
  type UserProfileContract,
  type UsersOverviewContract,
} from '@swisskit/contracts/users';
import { apiClient } from './client';

export async function getUsersOverview(): Promise<UsersOverviewContract> {
  const payload = await apiClient.get<unknown>('/users');

  return UsersOverviewSchema.parse(payload);
}

export async function createOrReactivateUser(
  input: CreateUserInputContract,
): Promise<UserProfileContract> {
  const payload = await apiClient.post<unknown, CreateUserInputContract>(
    '/users',
    CreateUserInputSchema.parse(input),
  );
  return UserProfileSchema.parse(payload);
}

export async function updateUserStatus(
  id: string,
  input: UpdateUserStatusInputContract,
): Promise<UserProfileContract> {
  const payload = await apiClient.patch<unknown, UpdateUserStatusInputContract>(
    `/users/${id}/status`,
    UpdateUserStatusInputSchema.parse(input),
  );
  return UserProfileSchema.parse(payload);
}
