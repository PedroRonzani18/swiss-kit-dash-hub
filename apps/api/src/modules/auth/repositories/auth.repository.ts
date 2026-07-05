import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import type {
  EffectiveAccessContract,
  GoogleAuthProfileContract,
  UserContract,
} from '@/common/contracts';
import { mapUserFromPersistence } from '@/common/mappers';
import { AUTH_PROVIDER } from '@/common/enums';

const PRIMARY_OWNER_EMAIL = 'pedroaugustogabironzani@gmail.com';
const ADMIN_ROLE_KEY = 'admin';
const MEMBER_ROLE_KEY = 'member';

const userSelect = {
  id: true,
  email: true,
  name: true,
  avatarUrl: true,
  provider: true,
  providerUserId: true,
  lastLoginAt: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

type UserRow = Prisma.UserGetPayload<{ select: typeof userSelect }>;

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async isAllowedEmail(email: string): Promise<boolean> {
    const normalizedEmail = email.toLowerCase().trim();

    const record = await this.prisma.allowedEmail.findFirst({
      select: {
        id: true,
      },
      where: {
        email: normalizedEmail,
        isActive: true,
      },
    });

    return Boolean(record);
  }

  async findById(id: string): Promise<UserContract | null> {
    const record = await this.prisma.user.findUnique({
      select: userSelect,
      where: { id },
    });

    return record ? mapUserFromPersistence(record as UserRow) : null;
  }

  async getEffectiveAccess(userId: string): Promise<EffectiveAccessContract> {
    const [directPermissions, roleAssignments] = await Promise.all([
      this.prisma.userPermission.findMany({
        select: {
          permission: {
            select: {
              key: true,
            },
          },
        },
        where: { userId },
      }),
      this.prisma.userRole.findMany({
        select: {
          role: {
            select: {
              key: true,
              permissions: {
                select: {
                  permission: {
                    select: {
                      key: true,
                    },
                  },
                },
              },
            },
          },
        },
        where: { userId },
      }),
    ]);

    const roles = new Set<string>();
    const permissions = new Set<string>();

    for (const directPermission of directPermissions) {
      permissions.add(directPermission.permission.key);
    }

    for (const assignment of roleAssignments) {
      roles.add(assignment.role.key);

      for (const rolePermission of assignment.role.permissions) {
        permissions.add(rolePermission.permission.key);
      }
    }

    return {
      roles: [...roles].sort(),
      permissions: [...permissions].sort() as EffectiveAccessContract['permissions'],
    };
  }

  async upsertGoogleUser(
    profile: GoogleAuthProfileContract,
  ): Promise<UserContract> {
    const record = await this.prisma.user.upsert({
      select: userSelect,
      where: { email: profile.email },
      update: {
        name: profile.name,
        avatarUrl: profile.avatarUrl,
        provider: AUTH_PROVIDER.GOOGLE,
        providerUserId: profile.providerUserId,
        lastLoginAt: new Date(),
      },
      create: {
        email: profile.email,
        name: profile.name,
        avatarUrl: profile.avatarUrl,
        provider: AUTH_PROVIDER.GOOGLE,
        providerUserId: profile.providerUserId,
        lastLoginAt: new Date(),
      },
    });

    await this.assignDefaultRole(record.id, record.email);

    return mapUserFromPersistence(record as UserRow);
  }

  private async assignDefaultRole(userId: string, email: string): Promise<void> {
    const roleKey =
      email.toLowerCase() === PRIMARY_OWNER_EMAIL ? ADMIN_ROLE_KEY : MEMBER_ROLE_KEY;

    const role = await this.prisma.role.findUnique({
      select: { id: true },
      where: { key: roleKey },
    });

    if (!role) {
      return;
    }

    await this.prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId,
          roleId: role.id,
        },
      },
      update: {},
      create: {
        userId,
        roleId: role.id,
      },
    });
  }
}
