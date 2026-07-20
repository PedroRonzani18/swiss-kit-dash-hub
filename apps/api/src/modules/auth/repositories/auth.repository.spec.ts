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
  const transaction = {
    user: {
      findUnique: jest.fn(),
      updateMany: jest.fn(),
      findUniqueOrThrow: jest.fn(),
    },
    role: { findUnique: jest.fn() },
    userRole: { findFirst: jest.fn(), upsert: jest.fn() },
  };
  const prisma = { $transaction: jest.fn() };

  let repository: AuthRepository;

  beforeEach(() => {
    jest.resetAllMocks();
    repository = new AuthRepository(prisma as unknown as PrismaService);
    prisma.$transaction.mockImplementation((callback) => callback(transaction));
    transaction.user.findUnique
      .mockResolvedValueOnce({
        id: user.id,
        isActive: true,
        providerUserId: null,
      })
      .mockResolvedValueOnce(null);
    transaction.user.updateMany.mockResolvedValue({ count: 1 });
    transaction.user.findUniqueOrThrow.mockResolvedValue(user);
    transaction.userRole.findFirst.mockResolvedValue(null);
    transaction.role.findUnique.mockResolvedValue({ id: 'role-1' });
  });

  it('claims an active unbound user and assigns the member role', async () => {
    await expect(
      repository.claimGoogleUser({
        email: user.email,
        name: user.name,
        avatarUrl: null,
        providerUserId: user.providerUserId,
      }),
    ).resolves.toMatchObject({ status: 'claimed', user: { id: user.id } });

    expect(transaction.user.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ isActive: true }),
      }),
    );
  });

  it('rejects an inactive or unknown email without creating a user', async () => {
    transaction.user.findUnique.mockReset();
    transaction.user.findUnique
      .mockResolvedValueOnce({
        id: user.id,
        isActive: false,
        providerUserId: null,
      })
      .mockResolvedValueOnce(null);

    await expect(
      repository.claimGoogleUser({
        email: user.email,
        name: user.name,
        avatarUrl: null,
        providerUserId: user.providerUserId,
      }),
    ).resolves.toEqual({ status: 'not-allowed' });

    expect(transaction.user.updateMany).not.toHaveBeenCalled();
  });

  it('does not rebind a Google identity owned by another user', async () => {
    transaction.user.findUnique.mockReset();
    transaction.user.findUnique
      .mockResolvedValueOnce({
        id: user.id,
        isActive: true,
        providerUserId: null,
      })
      .mockResolvedValueOnce({ id: 'other-user' });

    await expect(
      repository.claimGoogleUser({
        email: user.email,
        name: user.name,
        avatarUrl: null,
        providerUserId: user.providerUserId,
      }),
    ).resolves.toEqual({ status: 'identity-conflict' });

    expect(transaction.user.updateMany).not.toHaveBeenCalled();
  });
});
