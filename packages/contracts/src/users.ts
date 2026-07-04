import { z } from 'zod';

export const UserProfileSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().nullable(),
  avatarUrl: z.string().url().nullable(),
  provider: z.literal('google'),
  lastLoginAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const UsersOverviewSchema = z.object({
  module: z.literal('users'),
  status: z.literal('available'),
  users: z.array(UserProfileSchema),
});

export type UserProfileContract = z.infer<typeof UserProfileSchema>;
export type UsersOverviewContract = z.infer<typeof UsersOverviewSchema>;
