import { Injectable } from '@nestjs/common';
import type { AccessControlOverviewContract } from '@swisskit/contracts/access-control';
import {
  ACCESS_CONTROL_CORE_PERMISSIONS,
  ACCESS_CONTROL_PERMISSION_GROUPS,
} from '@swisskit/contracts/access-control-catalog';
import type {
  PermissionActionContract,
  PermissionContract,
  PermissionGroupContract,
  PermissionKeyContract,
  RoleContract,
} from '@swisskit/contracts/permissions';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class AccessControlService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview(): Promise<AccessControlOverviewContract> {
    const [permissionOverview, roles] = await Promise.all([
      this.getPermissions(),
      this.getRoles(),
    ]);

    return {
      module: 'access-control',
      status: 'available',
      permissionGroups: permissionOverview.permissionGroups,
      permissions: permissionOverview.permissions,
      roles,
    };
  }

  private async getPermissions(): Promise<{
    permissionGroups: Array<
      PermissionGroupContract & { permissions: PermissionContract[] }
    >;
    permissions: PermissionContract[];
  }> {
    const [permissionGroups, permissions] = await Promise.all([
      this.prisma.permissionGroup.findMany({
        orderBy: [{ sortOrder: 'asc' }, { key: 'asc' }],
      }),
      this.prisma.permission.findMany({
        include: {
          group: true,
        },
        orderBy: [
          { group: { sortOrder: 'asc' } },
          { moduleId: 'asc' },
          { action: 'asc' },
          { key: 'asc' },
        ],
      }),
    ]);

    if (!permissionGroups.length || !permissions.length) {
      const fallbackPermissions = [...ACCESS_CONTROL_CORE_PERMISSIONS].map(
        (permission) => ({
          ...permission,
          group: permission.group ?? this.getFallbackGroup(permission.moduleId),
        }),
      );

      return {
        permissionGroups: this.buildPermissionGroups(
          ACCESS_CONTROL_PERMISSION_GROUPS,
          fallbackPermissions,
        ),
        permissions: fallbackPermissions,
      };
    }

    const mappedGroups = permissionGroups.map((group) => ({
      id: group.id,
      key: group.key,
      label: group.label,
      description: group.description,
      sortOrder: group.sortOrder,
    }));

    const mappedPermissions = permissions.map((permission) => ({
      id: permission.id,
      key: permission.key as PermissionKeyContract,
      moduleId: permission.moduleId,
      groupId: permission.groupId,
      action: permission.action as PermissionActionContract,
      label: permission.label,
      description: permission.description,
      group: {
        id: permission.group.id,
        key: permission.group.key,
        label: permission.group.label,
        description: permission.group.description,
        sortOrder: permission.group.sortOrder,
      },
    }));

    return {
      permissionGroups: this.buildPermissionGroups(
        mappedGroups,
        mappedPermissions,
      ),
      permissions: mappedPermissions,
    };
  }

  private buildPermissionGroups(
    groups: readonly PermissionGroupContract[],
    permissions: PermissionContract[],
  ): Array<PermissionGroupContract & { permissions: PermissionContract[] }> {
    return groups.map((group) => ({
      ...group,
      permissions: permissions.filter(
        (permission) => permission.groupId === group.id,
      ),
    }));
  }

  private getFallbackGroup(moduleId: string): PermissionGroupContract {
    const group = ACCESS_CONTROL_PERMISSION_GROUPS.find(
      (candidate) => candidate.key === moduleId,
    );

    if (!group) {
      return {
        id: `group.${moduleId}`,
        key: moduleId,
        label: moduleId,
        description: null,
        sortOrder: Number.MAX_SAFE_INTEGER,
      };
    }

    return group;
  }

  private mapPermission(permission: {
    id: string;
    key: string;
    moduleId: string;
    groupId: string;
    action: string;
    label: string;
    description: string | null;
    group?: PermissionGroupContract;
  }): PermissionContract {
    return {
      id: permission.id,
      key: permission.key as PermissionKeyContract,
      moduleId: permission.moduleId,
      groupId: permission.groupId,
      action: permission.action as PermissionActionContract,
      label: permission.label,
      description: permission.description,
      group: permission.group,
    };
  }

  private async getRoles(): Promise<RoleContract[]> {
    const roles = await this.prisma.role.findMany({
      include: {
        permissions: {
          include: {
            permission: {
              include: {
                group: true,
              },
            },
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
        .map((permission) =>
          this.mapPermission({
            id: permission.id,
            key: permission.key,
            moduleId: permission.moduleId,
            groupId: permission.groupId,
            action: permission.action,
            label: permission.label,
            description: permission.description,
            group: {
              id: permission.group.id,
              key: permission.group.key,
              label: permission.group.label,
              description: permission.group.description,
              sortOrder: permission.group.sortOrder,
            },
          }),
        ),
    }));
  }
}
