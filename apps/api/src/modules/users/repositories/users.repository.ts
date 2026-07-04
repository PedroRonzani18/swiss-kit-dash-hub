import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import type { UserProfileContract } from '@swisskit/contracts/users';
import { mapUserProfileFromPersistence } from '../mappers/user.mapper';

const userProfileSelect = {
  id: true,
  email: true,
  name: true,
  avatarUrl: true,
  provider: true,
  lastLoginAt: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

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
}
