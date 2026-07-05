import { randomUUID } from 'node:crypto';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { ACCESS_CONTROL_CORE_PERMISSIONS } from '@swisskit/contracts/access-control-catalog';
import type { PermissionKeyContract } from '@swisskit/contracts/permissions';
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
    permissions?: PermissionKeyContract[];
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

  for (const permissionKey of input?.permissions ?? []) {
    const permissionDefinition = ACCESS_CONTROL_CORE_PERMISSIONS.find(
      (permission) => permission.key === permissionKey,
    );

    if (!permissionDefinition) {
      throw new Error(`Unknown test permission: ${permissionKey}`);
    }

    const groupDefinition = permissionDefinition.group;

    if (!groupDefinition) {
      throw new Error(
        `Permission group not found for test permission: ${permissionKey}`,
      );
    }

    const group = await prisma.permissionGroup.upsert({
      where: { key: groupDefinition.key },
      update: {
        label: groupDefinition.label,
        description: groupDefinition.description,
        sortOrder: groupDefinition.sortOrder,
      },
      create: {
        key: groupDefinition.key,
        label: groupDefinition.label,
        description: groupDefinition.description,
        sortOrder: groupDefinition.sortOrder,
      },
      select: {
        id: true,
      },
    });

    const permission = await prisma.permission.upsert({
      where: { key: permissionDefinition.key },
      update: {
        moduleId: permissionDefinition.moduleId,
        groupId: group.id,
        action: permissionDefinition.action,
        label: permissionDefinition.label,
        description: permissionDefinition.description,
      },
      create: {
        key: permissionDefinition.key,
        moduleId: permissionDefinition.moduleId,
        groupId: group.id,
        action: permissionDefinition.action,
        label: permissionDefinition.label,
        description: permissionDefinition.description,
      },
    });

    await prisma.userPermission.create({
      data: {
        userId: user.id,
        permissionId: permission.id,
      },
    });
  }

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
