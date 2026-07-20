import { AUTH_PROVIDER } from '@/common/enums';
import { PrismaService } from '@/prisma/prisma.service';
import { AuthRepository } from './auth.repository';

const user = {
  id: 'user-1',
  email: 'initial-admin@swisskit.test',
  name: 'Initial Admin',
  avatarUrl: null,
  provider: AUTH_PROVIDER.GOOGLE,
  providerUserId: 'google-user-1',
  lastLoginAt: new Date('2026-01-01T00:00:00.000Z'),
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
};

describe('AuthRepository', () => {
  const prisma = {
    user: {
      upsert: jest.fn(),
    },
    role: {
      findUnique: jest.fn(),
    },
    userRole: {
      findFirst: jest.fn(),
      upsert: jest.fn(),
    },
  };

  let repository: AuthRepository;

  beforeEach(() => {
    jest.resetAllMocks();
    repository = new AuthRepository(prisma as unknown as PrismaService);
    prisma.user.upsert.mockResolvedValue(user);
    prisma.userRole.findFirst.mockResolvedValue(null);
    prisma.role.findUnique.mockResolvedValue({ id: 'role-1' });
  });

  it('assigns the member role to a user with no role assignments', async () => {
    await repository.upsertGoogleUser({
      email: 'initial-admin@swisskit.test',
      name: 'Initial Admin',
      avatarUrl: null,
      providerUserId: 'google-user-1',
    });

    expect(prisma.role.findUnique).toHaveBeenCalledWith({
      select: { id: true },
      where: { key: 'member' },
    });
    expect(prisma.userRole.upsert).toHaveBeenCalledWith({
      where: {
        userId_roleId: {
          userId: user.id,
          roleId: 'role-1',
        },
      },
      update: {},
      create: {
        userId: user.id,
        roleId: 'role-1',
      },
    });
  });

  it('preserves existing role assignments on later logins', async () => {
    prisma.userRole.findFirst.mockResolvedValue({ userId: user.id });

    await repository.upsertGoogleUser({
      email: user.email,
      name: user.name,
      avatarUrl: null,
      providerUserId: user.providerUserId,
    });

    expect(prisma.role.findUnique).not.toHaveBeenCalled();
    expect(prisma.userRole.upsert).not.toHaveBeenCalled();
  });
});
