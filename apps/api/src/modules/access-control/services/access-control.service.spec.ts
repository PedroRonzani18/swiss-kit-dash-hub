import { ACCESS_CONTROL_PERMISSION_GROUPS } from '@swisskit/contracts/access-control-catalog';
import type { PrismaService } from '@/prisma/prisma.service';
import { AccessControlService } from './access-control.service';

describe('AccessControlService', () => {
  it('returns static groups and permissions when persisted access-control data is missing', async () => {
    const prisma = {
      permissionGroup: {
        findMany: async () => [],
      },
      permission: {
        findMany: async () => [],
      },
      role: {
        findMany: async () => [],
      },
    } as unknown as PrismaService;

    const service = new AccessControlService(prisma);
    const overview = await service.getOverview();

    expect(overview.permissionGroups).toEqual(
      ACCESS_CONTROL_PERMISSION_GROUPS.map((group) => ({
        ...group,
        permissions: overview.permissions.filter(
          (permission) => permission.groupId === group.id,
        ),
      })),
    );
    expect(overview.roles).toEqual([]);
  });

  it('returns persisted groups, permissions and role mappings', async () => {
    const prisma = {
      permissionGroup: {
        findMany: async () => [
          {
            id: 'group.users',
            key: 'users',
            label: 'Users',
            description: 'Authenticated user directory and profile visibility.',
            sortOrder: 30,
          },
        ],
      },
      permission: {
        findMany: async () => [
          {
            id: 'permission.users.read',
            key: 'users:read',
            moduleId: 'users',
            groupId: 'group.users',
            action: 'read',
            label: 'Read Users',
            description: 'Allows reading authenticated user profiles.',
            group: {
              id: 'group.users',
              key: 'users',
              label: 'Users',
              description:
                'Authenticated user directory and profile visibility.',
              sortOrder: 30,
            },
          },
        ],
      },
      role: {
        findMany: async () => [
          {
            id: 'role.users-viewer',
            key: 'users-viewer',
            label: 'Users Viewer',
            description: 'Views authenticated user profiles.',
            permissions: [
              {
                permission: {
                  id: 'permission.users.read',
                  key: 'users:read',
                  moduleId: 'users',
                  groupId: 'group.users',
                  action: 'read',
                  label: 'Read Users',
                  description: 'Allows reading authenticated user profiles.',
                  group: {
                    id: 'group.users',
                    key: 'users',
                    label: 'Users',
                    description:
                      'Authenticated user directory and profile visibility.',
                    sortOrder: 30,
                  },
                },
              },
            ],
          },
        ],
      },
    } as unknown as PrismaService;

    const service = new AccessControlService(prisma);

    await expect(service.getOverview()).resolves.toEqual({
      module: 'access-control',
      status: 'available',
      permissionGroups: [
        {
          id: 'group.users',
          key: 'users',
          label: 'Users',
          description: 'Authenticated user directory and profile visibility.',
          sortOrder: 30,
          permissions: [
            {
              id: 'permission.users.read',
              key: 'users:read',
              moduleId: 'users',
              groupId: 'group.users',
              action: 'read',
              label: 'Read Users',
              description: 'Allows reading authenticated user profiles.',
              group: {
                id: 'group.users',
                key: 'users',
                label: 'Users',
                description:
                  'Authenticated user directory and profile visibility.',
                sortOrder: 30,
              },
            },
          ],
        },
      ],
      permissions: [
        {
          id: 'permission.users.read',
          key: 'users:read',
          moduleId: 'users',
          groupId: 'group.users',
          action: 'read',
          label: 'Read Users',
          description: 'Allows reading authenticated user profiles.',
          group: {
            id: 'group.users',
            key: 'users',
            label: 'Users',
            description: 'Authenticated user directory and profile visibility.',
            sortOrder: 30,
          },
        },
      ],
      roles: [
        {
          id: 'role.users-viewer',
          key: 'users-viewer',
          label: 'Users Viewer',
          description: 'Views authenticated user profiles.',
          permissions: [
            {
              id: 'permission.users.read',
              key: 'users:read',
              moduleId: 'users',
              groupId: 'group.users',
              action: 'read',
              label: 'Read Users',
              description: 'Allows reading authenticated user profiles.',
              group: {
                id: 'group.users',
                key: 'users',
                label: 'Users',
                description:
                  'Authenticated user directory and profile visibility.',
                sortOrder: 30,
              },
            },
          ],
        },
      ],
    });
  });
});
