import { z } from 'zod';
import { EffectivePermissionsSchema } from './permissions';
import { AuthProviderSchema } from './core';

export const AuthStatusSchema = z.object({
  success: z.boolean(),
});

export const CurrentUserSchema = z
  .object({
    id: z.string(),
    email: z.string().email(),
    name: z.string().nullable(),
    avatarUrl: z.string().url().nullable(),
    provider: AuthProviderSchema,
    lastLoginAt: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .merge(EffectivePermissionsSchema.partial());

export const AuthSessionSchema = z.object({
  user: CurrentUserSchema,
  authenticated: z.boolean(),
});

export type AuthStatusContract = z.infer<typeof AuthStatusSchema>;
export type CurrentUserContract = z.infer<typeof CurrentUserSchema>;
export type AuthSessionContract = z.infer<typeof AuthSessionSchema>;
