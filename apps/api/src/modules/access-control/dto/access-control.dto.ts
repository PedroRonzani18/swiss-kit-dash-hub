import { ApiProperty } from '@nestjs/swagger';
import type {
  AccessControlOverviewContract,
  AssignUserRoleInputContract,
  UserAccessOverviewContract,
} from '@swisskit/contracts/access-control';
import type {
  PermissionContract,
  PermissionGroupContract,
  PermissionKeyContract,
  RoleContract,
} from '@swisskit/contracts/permissions';
import { IsString, MinLength } from 'class-validator';

export class PermissionGroupDto implements PermissionGroupContract {
  @ApiProperty({ example: 'group.users' })
  id!: string;

  @ApiProperty({ example: 'users' })
  key!: string;

  @ApiProperty({ example: 'Users' })
  label!: string;

  @ApiProperty({
    example: 'Authenticated user directory and profile visibility.',
    nullable: true,
  })
  description?: string | null;

  @ApiProperty({ example: 30 })
  sortOrder!: number;
}

export class PermissionDto implements PermissionContract {
  @ApiProperty({ example: 'users.access' })
  id!: string;

  @ApiProperty({ example: 'users:access' })
  key!: PermissionContract['key'];

  @ApiProperty({ example: 'users' })
  moduleId!: string;

  @ApiProperty({ example: 'group.users' })
  groupId!: string;

  @ApiProperty({ example: 'access' })
  action!: PermissionContract['action'];

  @ApiProperty({ example: 'Access Users' })
  label!: string;

  @ApiProperty({
    example: 'Allows access to the Users module.',
    nullable: true,
  })
  description?: string | null;

  @ApiProperty({ type: () => PermissionGroupDto, required: false })
  group?: PermissionGroupDto;
}

export class PermissionGroupOverviewDto extends PermissionGroupDto {
  @ApiProperty({ type: () => [PermissionDto] })
  permissions!: PermissionDto[];
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

  @ApiProperty({ type: () => [PermissionGroupOverviewDto] })
  permissionGroups!: PermissionGroupOverviewDto[];

  @ApiProperty({ type: () => [PermissionDto] })
  permissions!: PermissionDto[];

  @ApiProperty({ type: () => [RoleDto] })
  roles!: RoleDto[];
}

export class AssignUserRoleInputDto implements AssignUserRoleInputContract {
  @ApiProperty({ example: 'member' })
  @IsString()
  @MinLength(1)
  roleKey!: string;
}

export class UserAccessOverviewDto implements UserAccessOverviewContract {
  @ApiProperty({ example: 'user-id' })
  userId!: string;

  @ApiProperty({ type: [String], example: ['member'] })
  roles!: string[];

  @ApiProperty({
    type: [String],
    example: ['core:access', 'settings:access'],
  })
  permissions!: PermissionKeyContract[];
}
