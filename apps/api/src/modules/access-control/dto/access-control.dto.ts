import { ApiProperty } from '@nestjs/swagger';
import type {
  AccessControlOverviewContract,
  PermissionContract,
  RoleContract,
} from '@swisskit/contracts';

export class PermissionDto implements PermissionContract {
  @ApiProperty({ example: 'users.access' })
  id!: string;

  @ApiProperty({ example: 'users:access' })
  key!: PermissionContract['key'];

  @ApiProperty({ example: 'users' })
  moduleId!: string;

  @ApiProperty({ example: 'access' })
  action!: PermissionContract['action'];

  @ApiProperty({ example: 'Access Users' })
  label!: string;

  @ApiProperty({ example: 'Allows access to the Users module.', nullable: true })
  description?: string | null;
}

export class RoleDto implements RoleContract {
  @ApiProperty({ example: 'admin' })
  id!: string;

  @ApiProperty({ example: 'admin' })
  key!: string;

  @ApiProperty({ example: 'Admin' })
  label!: string;

  @ApiProperty({ example: 'Template administrator role.', nullable: true })
  description?: string | null;

  @ApiProperty({ type: () => [PermissionDto] })
  permissions!: PermissionDto[];
}

export class AccessControlOverviewDto implements AccessControlOverviewContract {
  @ApiProperty({ example: 'access-control' })
  module!: 'access-control';

  @ApiProperty({ example: 'available' })
  status!: 'available';

  @ApiProperty({ type: () => [PermissionDto] })
  permissions!: PermissionDto[];

  @ApiProperty({ type: () => [RoleDto] })
  roles!: RoleDto[];
}
