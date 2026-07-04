import type { AllowedEmailContract } from '@swisskit/contracts/allowed-emails';
import type { AccessListRepository } from '../repositories/access-list.repository';
import { AccessListService } from '../services/access-list.service';

describe('AccessListService', () => {
  it('returns the access list overview', async () => {
    const entry: AllowedEmailContract = {
      id: 'entry-id',
      email: 'user@example.com',
      isActive: true,
      note: null,
      createdAt: '2026-07-04T21:00:00.000Z',
      updatedAt: '2026-07-04T21:00:00.000Z',
    };

    const repository = {
      listEntries: async () => [entry],
    } as unknown as AccessListRepository;

    const service = new AccessListService(repository);

    await expect(service.getOverview()).resolves.toEqual({
      module: 'allowed-emails',
      status: 'available',
      allowedEmails: [entry],
    });
  });
});
