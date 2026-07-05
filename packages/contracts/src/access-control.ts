import { z } from 'zod';
import {
  PermissionKeySchema,
  PermissionGroupSchema,
  PermissionSchema,
  RoleSchema,
} from './permissions';

export * from './access-control-catalog';

export const PermissionGroupWithPermissionsSchema =
  PermissionGroupSchema.extend({
    permissions: z.array(PermissionSchema),
  });

export const AccessControlOverviewSchema = z.object({
  module: z.literal('access-control'),
  status: z.literal('available'),
  permissionGroups: z.array(PermissionGroupWithPermissionsSchema),
  permissions: z.array(PermissionSchema),
  roles: z.array(RoleSchema),
});

export const UserAccessOverviewSchema = z.object({
  userId: z.string(),
  roles: z.array(z.string()),
  permissions: z.array(PermissionKeySchema),
});

export const AssignUserRoleInputSchema = z.object({
  roleKey: z.string().min(1),
});

export type AccessControlOverviewContract = z.infer<
  typeof AccessControlOverviewSchema
>;
export type UserAccessOverviewContract = z.infer<
  typeof UserAccessOverviewSchema
>;
export type AssignUserRoleInputContract = z.infer<
  typeof AssignUserRoleInputSchema
>;
