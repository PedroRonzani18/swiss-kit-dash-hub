import { z } from 'zod';
import { AuthProviderSchema } from './core';

export const UserProfileSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().nullable(),
  avatarUrl: z.string().url().nullable(),
  isActive: z.boolean(),
  note: z.string().nullable(),
  provider: AuthProviderSchema.nullable(),
  lastLoginAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const CreateUserInputSchema = z.object({
  email: z.string().email(),
  note: z.string().nullable().optional(),
});

export const UpdateUserStatusInputSchema = z.object({
  isActive: z.boolean(),
});

export const UsersOverviewSchema = z.object({
  module: z.literal('users'),
  status: z.literal('available'),
  users: z.array(UserProfileSchema),
});

export type UserProfileContract = z.infer<typeof UserProfileSchema>;
export type UsersOverviewContract = z.infer<typeof UsersOverviewSchema>;
export type CreateUserInputContract = z.infer<typeof CreateUserInputSchema>;
export type UpdateUserStatusInputContract = z.infer<
  typeof UpdateUserStatusInputSchema
>;
