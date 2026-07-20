import { z } from 'zod';

export const AuthProviderSchema = z.literal('google');
export type AuthProvider = z.infer<typeof AuthProviderSchema>;
export type EntityId = string;
export type IsoDateString = string;
