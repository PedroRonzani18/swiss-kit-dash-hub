import type { AllowedEmailContract } from '@swisskit/contracts/allowed-emails';
import type { AccessListRepository } from '../repositories/access-list.repository';
import { AccessListService } from '../services/access-list.service';

const entry: AllowedEmailContract = {
  id: 'entry-id',
  email: 'user@example.com',
  isActive: true,
  note: null,
  createdAt: '2026-07-04T21:00:00.000Z',
  updatedAt: '2026-07-04T21:00:00.000Z',
};

describe('AccessListService', () => {
  it('returns the access list overview', async () => {
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

  it('creates or reactivates an entry', async () => {
    const repository = {
      createOrReactivateEntry: async () => entry,
    } as unknown as AccessListRepository;

    const service = new AccessListService(repository);

    await expect(
      service.createEntry({
        email: entry.email,
        note: entry.note,
      }),
    ).resolves.toEqual(entry);
  });

  it('updates an entry status', async () => {
    const inactiveEntry = {
      ...entry,
      isActive: false,
    };

    const repository = {
      updateEntryStatus: async () => inactiveEntry,
    } as unknown as AccessListRepository;

    const service = new AccessListService(repository);

    await expect(
      service.updateEntryStatus(entry.id, { isActive: false }),
    ).resolves.toEqual(inactiveEntry);
  });
});
