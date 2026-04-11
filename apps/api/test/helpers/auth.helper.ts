import { randomUUID } from 'node:crypto';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { AUTH_PROVIDER } from '@/common/enums';
import { PrismaService } from '@/prisma/prisma.service';

export type AuthenticatedTestUser = {
  user: User;
  token: string;
  authHeader: Record<string, string>;
  authCookie: string;
};

export async function createAuthenticatedTestUser(
  app: INestApplication,
  prisma: PrismaService,
  input?: {
    email?: string;
    name?: string | null;
  },
): Promise<AuthenticatedTestUser> {
  const email = input?.email ?? `integration-${randomUUID()}@swisskit.test`;
  const user = await prisma.user.create({
    data: {
      email,
      name: input?.name ?? 'Integration User',
      avatarUrl: null,
      provider: AUTH_PROVIDER.GOOGLE,
      providerUserId: randomUUID(),
      lastLoginAt: new Date(),
    },
  });

  const jwtService = app.get(JwtService);
  const token = await jwtService.signAsync({
    sub: user.id,
    email: user.email,
    name: user.name,
    provider: user.provider,
  });

  const cookieName = process.env.AUTH_COOKIE_NAME ?? 'swisskit_auth';

  return {
    user,
    token,
    authHeader: {
      Authorization: `Bearer ${token}`,
    },
    authCookie: `${cookieName}=${token}`,
  };
}
