import { Injectable } from '@nestjs/common';
import type { AccessControlOverviewContract } from '@swisskit/contracts/access-control';
import { ACCESS_CONTROL_CORE_PERMISSIONS } from '@swisskit/contracts/access-control-catalog';
import type {
  PermissionActionContract,
  PermissionContract,
  PermissionKeyContract,
  RoleContract,
} from '@swisskit/contracts/permissions';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class AccessControlService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview(): Promise<AccessControlOverviewContract> {
    const [permissions, roles] = await Promise.all([
      this.getPermissions(),
      this.getRoles(),
    ]);

    return {
      module: 'access-control',
      status: 'available',
      permissions,
      roles,
    };
  }

  private async getPermissions(): Promise<PermissionContract[]> {
    const permissions = await this.prisma.permission.findMany({
      orderBy: [{ moduleId: 'asc' }, { action: 'asc' }, { key: 'asc' }],
    });

    if (!permissions.length) {
      return [...ACCESS_CONTROL_CORE_PERMISSIONS];
    }

    return permissions.map((permission) => ({
      id: permission.id,
      key: permission.key as PermissionKeyContract,
      moduleId: permission.moduleId,
      action: permission.action as PermissionActionContract,
      label: permission.label,
      description: permission.description,
    }));
  }

  private async getRoles(): Promise<RoleContract[]> {
    const roles = await this.prisma.role.findMany({
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
      orderBy: [{ isSystem: 'desc' }, { key: 'asc' }],
    });

    return roles.map((role) => ({
      id: role.id,
      key: role.key,
      label: role.label,
      description: role.description,
      permissions: role.permissions
        .map((rolePermission) => rolePermission.permission)
        .sort((left, right) => left.key.localeCompare(right.key))
        .map((permission) => ({
          id: permission.id,
          key: permission.key as PermissionKeyContract,
          moduleId: permission.moduleId,
          action: permission.action as PermissionActionContract,
          label: permission.label,
          description: permission.description,
        })),
    }));
  }
}
