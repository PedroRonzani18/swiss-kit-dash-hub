import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import type {
  CreateUserInputContract,
  UpdateUserStatusInputContract,
  UserProfileContract,
} from '@swisskit/contracts/users';
import { mapUserProfileFromPersistence } from '../mappers/user.mapper';

const userProfileSelect = {
  id: true,
  email: true,
  name: true,
  avatarUrl: true,
  isActive: true,
  note: true,
  provider: true,
  lastLoginAt: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

const ADMIN_ROLE_KEY = 'admin';

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function normalizeNote(note?: string | null): string | null {
  const normalizedNote = note?.trim();
  return normalizedNote || null;
}

type UserProfileRow = Prisma.UserGetPayload<{
  select: typeof userProfileSelect;
}>;

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listProfiles(): Promise<UserProfileContract[]> {
    const records = await this.prisma.user.findMany({
      select: userProfileSelect,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      mapUserProfileFromPersistence(record as UserProfileRow),
    );
  }

  async createOrReactivate(
    input: CreateUserInputContract,
  ): Promise<UserProfileContract> {
    const record = await this.prisma.user.upsert({
      select: userProfileSelect,
      where: { email: normalizeEmail(input.email) },
      update: { isActive: true, note: normalizeNote(input.note) },
      create: {
        email: normalizeEmail(input.email),
        isActive: true,
        note: normalizeNote(input.note),
      },
    });

    return mapUserProfileFromPersistence(record as UserProfileRow);
  }

  async updateStatus(
    id: string,
    input: UpdateUserStatusInputContract,
    actorId: string,
  ): Promise<UserProfileContract> {
    if (!input.isActive && id === actorId) {
      throw new Error('SELF_DEACTIVATION');
    }

    return this.prisma.$transaction(
      async (transaction) => {
        const user = await transaction.user.findUnique({
          where: { id },
          select: {
            ...userProfileSelect,
            roles: { select: { role: { select: { key: true } } } },
          },
        });

        if (!user) {
          throw new Error('USER_NOT_FOUND');
        }

        const isActiveAdmin =
          user.isActive &&
          user.roles.some(({ role }) => role.key === ADMIN_ROLE_KEY);

        if (!input.isActive && isActiveAdmin) {
          const activeAdminCount = await transaction.user.count({
            where: {
              isActive: true,
              roles: { some: { role: { key: ADMIN_ROLE_KEY } } },
            },
          });

          if (activeAdminCount <= 1) {
            throw new Error('LAST_ACTIVE_ADMIN');
          }
        }

        const record = await transaction.user.update({
          where: { id },
          select: userProfileSelect,
          data: {
            isActive: input.isActive,
            ...(!input.isActive ? { sessionVersion: { increment: 1 } } : {}),
          },
        });

        return mapUserProfileFromPersistence(record as UserProfileRow);
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
  }
}
