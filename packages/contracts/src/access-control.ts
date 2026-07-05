import { z } from 'zod';
import {
  PermissionSchema,
  RoleSchema,
} from './permissions';

export * from './access-control-catalog';

export const AccessControlOverviewSchema = z.object({
  module: z.literal('access-control'),
  status: z.literal('available'),
  permissions: z.array(PermissionSchema),
  roles: z.array(RoleSchema),
});

export type AccessControlOverviewContract = z.infer<
  typeof AccessControlOverviewSchema
>;
