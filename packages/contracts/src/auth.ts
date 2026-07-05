import { z } from 'zod';
import { UserProfileSchema } from './users';
import { EffectivePermissionsSchema } from './permissions';

export const AuthStatusSchema = z.object({
  success: z.boolean(),
});

export const CurrentUserSchema = UserProfileSchema.merge(
  EffectivePermissionsSchema.partial(),
);

export const AuthSessionSchema = z.object({
  user: CurrentUserSchema,
  authenticated: z.boolean(),
});

export type AuthStatusContract = z.infer<typeof AuthStatusSchema>;
export type CurrentUserContract = z.infer<typeof CurrentUserSchema>;
export type AuthSessionContract = z.infer<typeof AuthSessionSchema>;
