import { z } from 'zod';

export const PermissionActionSchema = z.enum([
  'access',
  'read',
  'create',
  'update',
  'delete',
  'manage',
]);

export const PermissionKeySchema = z
  .string()
  .regex(/^[a-z][a-z0-9-]*:(access|read|create|update|delete|manage)$/);

export const PermissionSchema = z.object({
  id: z.string(),
  key: PermissionKeySchema,
  moduleId: z.string(),
  action: PermissionActionSchema,
  label: z.string(),
  description: z.string().nullable().optional(),
});

export const RoleSchema = z.object({
  id: z.string(),
  key: z.string(),
  label: z.string(),
  description: z.string().nullable().optional(),
  permissions: z.array(PermissionSchema).default([]),
});

export const EffectivePermissionsSchema = z.object({
  permissions: z.array(PermissionKeySchema),
  roles: z.array(z.string()),
});

export const PERMISSION_ACTIONS = PermissionActionSchema.options;

export type PermissionActionContract = z.infer<typeof PermissionActionSchema>;
export type PermissionKeyContract = z.infer<typeof PermissionKeySchema>;
export type PermissionContract = z.infer<typeof PermissionSchema>;
export type RoleContract = z.infer<typeof RoleSchema>;
export type EffectivePermissionsContract = z.infer<
  typeof EffectivePermissionsSchema
>;
