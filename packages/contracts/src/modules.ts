import { z } from 'zod';
import { PermissionKeySchema } from './permissions';

export const AppModuleIdSchema = z.string().regex(/^[a-z][a-z0-9-]*$/);

export const AppModuleStatusSchema = z.enum(['available', 'disabled', 'hidden']);

export const AppModuleDefinitionSchema = z.object({
  id: AppModuleIdSchema,
  label: z.string(),
  description: z.string().optional(),
  path: z.string().startsWith('/'),
  nav: z.boolean().default(true),
  status: AppModuleStatusSchema.default('available'),
  requiredPermissions: z.array(PermissionKeySchema).default([]),
});

export const AppModuleRegistrySchema = z.object({
  modules: z.array(AppModuleDefinitionSchema),
});

export type AppModuleIdContract = z.infer<typeof AppModuleIdSchema>;
export type AppModuleStatusContract = z.infer<typeof AppModuleStatusSchema>;
export type AppModuleDefinitionContract = z.infer<
  typeof AppModuleDefinitionSchema
>;
export type AppModuleRegistryContract = z.infer<typeof AppModuleRegistrySchema>;
