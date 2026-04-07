import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import type {
  GoogleAuthProfileContract,
  UserContract,
} from '@/common/contracts';
import { mapUserFromPersistence } from '@/common/mappers';
import { AUTH_PROVIDER } from '@/common/enums';

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

    return mapUserFromPersistence(record as UserRow);
  }
}
