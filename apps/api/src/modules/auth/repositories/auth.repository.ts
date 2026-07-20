import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import type {
  EffectiveAccessContract,
  GoogleAuthProfileContract,
  UserContract,
} from '@/common/contracts';
import type { AuthProvider } from '@swisskit/contracts/core';
import { mapUserFromPersistence } from '@/common/mappers';
import { AUTH_PROVIDER } from '@/common/enums';

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
type AuthenticatedUserRow = UserRow & {
  provider: AuthProvider;
  providerUserId: string;
};

type ClaimGoogleUserResult =
  | { status: 'not-allowed' }
  | { status: 'identity-conflict' }
  | { status: 'claimed'; user: UserContract };

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<UserContract | null> {
    const record = await this.prisma.user.findUnique({
      select: userSelect,
      where: { id },
    });

    if (!record?.provider || !record.providerUserId) {
      return null;
    }

    return mapUserFromPersistence(record as AuthenticatedUserRow);
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
      permissions: [
        ...permissions,
      ].sort() as EffectiveAccessContract['permissions'],
    };
  }

  async claimGoogleUser(
    profile: GoogleAuthProfileContract,
  ): Promise<ClaimGoogleUserResult> {
    return this.prisma.$transaction(async (transaction) => {
      const [emailUser, identityUser] = await Promise.all([
        transaction.user.findUnique({
          where: { email: profile.email },
          select: { id: true, isActive: true, providerUserId: true },
        }),
        transaction.user.findUnique({
          where: { providerUserId: profile.providerUserId },
          select: { id: true },
        }),
      ]);

      if (!emailUser || !emailUser.isActive) {
        return { status: 'not-allowed' };
      }

      if (identityUser && identityUser.id !== emailUser.id) {
        return { status: 'identity-conflict' };
      }

      const claimed = await transaction.user.updateMany({
        where: {
          id: emailUser.id,
          isActive: true,
          OR: [
            { providerUserId: null },
            { providerUserId: profile.providerUserId },
          ],
        },
        data: {
          name: profile.name,
          avatarUrl: profile.avatarUrl,
          provider: AUTH_PROVIDER.GOOGLE,
          providerUserId: profile.providerUserId,
          lastLoginAt: new Date(),
        },
      });

      if (!claimed.count) {
        return { status: 'not-allowed' };
      }

      const record = await transaction.user.findUniqueOrThrow({
        select: userSelect,
        where: { id: emailUser.id },
      });

      if (!record.provider || !record.providerUserId) {
        return { status: 'identity-conflict' };
      }

      await this.assignMemberRoleWhenUnassigned(record.id, transaction);

      return {
        status: 'claimed',
        user: mapUserFromPersistence(record as AuthenticatedUserRow),
      };
    });
  }

  private async assignMemberRoleWhenUnassigned(
    userId: string,
    prisma: Prisma.TransactionClient = this.prisma,
  ): Promise<void> {
    const existingAssignment = await prisma.userRole.findFirst({
      select: { userId: true },
      where: { userId },
    });

    if (existingAssignment) {
      return;
    }

    const role = await prisma.role.findUnique({
      select: { id: true },
      where: { key: MEMBER_ROLE_KEY },
    });

    if (!role) {
      return;
    }

    await prisma.userRole.upsert({
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
