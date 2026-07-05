import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { PermissionKeyContract } from '@swisskit/contracts/permissions';
import { PrismaService } from '@/prisma/prisma.service';
import type { AuthenticatedRequest } from './auth-request.type';
import { REQUIRED_ACCESS_KEY } from './access.decorator';

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<
      PermissionKeyContract[]
    >(REQUIRED_ACCESS_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredPermissions?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user?.id) {
      throw new UnauthorizedException('Authenticated user not found');
    }

    const permissions = await this.getEffectivePermissions(user.id);
    const hasEveryPermission = requiredPermissions.every((permission) =>
      permissions.has(permission),
    );

    if (!hasEveryPermission) {
      throw new ForbiddenException('Missing required permissions');
    }

    return true;
  }

  private async getEffectivePermissions(userId: string): Promise<Set<string>> {
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

    const permissions = new Set<string>();

    for (const directPermission of directPermissions) {
      permissions.add(directPermission.permission.key);
    }

    for (const assignment of roleAssignments) {
      for (const rolePermission of assignment.role.permissions) {
        permissions.add(rolePermission.permission.key);
      }
    }

    return permissions;
  }
}
