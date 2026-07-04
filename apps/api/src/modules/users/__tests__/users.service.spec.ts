import type { UserProfileContract } from '@swisskit/contracts/users';
import { UsersService } from '../services/users.service';

describe('UsersService', () => {
  it('returns users overview from repository profiles', async () => {
    const user: UserProfileContract = {
      id: 'user-id',
      email: 'user@example.com',
      name: 'User Name',
      avatarUrl: null,
      provider: 'google',
      lastLoginAt: null,
      createdAt: '2026-07-04T21:00:00.000Z',
      updatedAt: '2026-07-04T21:00:00.000Z',
    };

    const service = new UsersService({
      listProfiles: async () => [user],
    });

    await expect(service.getOverview()).resolves.toEqual({
      module: 'users',
      status: 'available',
      users: [user],
    });
  });
});
