import { SetMetadata } from '@nestjs/common';
import type { PermissionKeyContract } from '@swisskit/contracts/permissions';

export const REQUIRED_ACCESS_KEY = 'required_access';

export const RequirePermissions = (...permissions: PermissionKeyContract[]) =>
  SetMetadata(REQUIRED_ACCESS_KEY, permissions);
