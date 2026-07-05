import { z } from 'zod';
import {
  PermissionSchema,
  RoleSchema,
  type PermissionContract,
} from './permissions';

export const CORE_PERMISSION_KEYS = [
  'core:access',
  'settings:access',
  'users:access',
  'users:read',
  'allowed-emails:access',
  'allowed-emails:read',
  'allowed-emails:create',
  'allowed-emails:update',
  'access-control:access',
  'access-control:read',
  'access-control:manage',
] as const;

export const CorePermissionKeySchema = z.enum(CORE_PERMISSION_KEYS);

export const ACCESS_CONTROL_CORE_PERMISSIONS = [
  {
    id: 'core.access',
    key: 'core:access',
    moduleId: 'core',
    action: 'access',
    label: 'Access Core',
    description: 'Allows access to the Core landing module.',
  },
  {
    id: 'settings.access',
    key: 'settings:access',
    moduleId: 'settings',
    action: 'access',
    label: 'Access Settings',
    description: 'Allows access to the Settings module.',
  },
  {
    id: 'users.access',
    key: 'users:access',
    moduleId: 'users',
    action: 'access',
    label: 'Access Users',
    description: 'Allows access to the Users module.',
  },
  {
    id: 'users.read',
    key: 'users:read',
    moduleId: 'users',
    action: 'read',
    label: 'Read Users',
    description: 'Allows reading authenticated user profiles.',
  },
  {
    id: 'allowed-emails.access',
    key: 'allowed-emails:access',
    moduleId: 'allowed-emails',
    action: 'access',
    label: 'Access Allowed Emails',
    description: 'Allows access to the allowed emails module.',
  },
  {
    id: 'allowed-emails.read',
    key: 'allowed-emails:read',
    moduleId: 'allowed-emails',
    action: 'read',
    label: 'Read Allowed Emails',
    description: 'Allows reading allowed email entries.',
  },
  {
    id: 'allowed-emails.create',
    key: 'allowed-emails:create',
    moduleId: 'allowed-emails',
    action: 'create',
    label: 'Create Allowed Emails',
    description: 'Allows creating allowed email entries.',
  },
  {
    id: 'allowed-emails.update',
    key: 'allowed-emails:update',
    moduleId: 'allowed-emails',
    action: 'update',
    label: 'Update Allowed Emails',
    description: 'Allows enabling or disabling allowed email entries.',
  },
  {
    id: 'access-control.access',
    key: 'access-control:access',
    moduleId: 'access-control',
    action: 'access',
    label: 'Access Control Module',
    description: 'Allows access to the access-control module.',
  },
  {
    id: 'access-control.read',
    key: 'access-control:read',
    moduleId: 'access-control',
    action: 'read',
    label: 'Read Access Control',
    description: 'Allows reading the permission catalog.',
  },
  {
    id: 'access-control.manage',
    key: 'access-control:manage',
    moduleId: 'access-control',
    action: 'manage',
    label: 'Manage Access Control',
    description: 'Allows managing future roles and permission assignments.',
  },
] as const satisfies readonly PermissionContract[];

export const AccessControlOverviewSchema = z.object({
  module: z.literal('access-control'),
  status: z.literal('available'),
  permissions: z.array(PermissionSchema),
  roles: z.array(RoleSchema),
});

export type CorePermissionKeyContract = z.infer<typeof CorePermissionKeySchema>;
export type AccessControlOverviewContract = z.infer<
  typeof AccessControlOverviewSchema
>;
