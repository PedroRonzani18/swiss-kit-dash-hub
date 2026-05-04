import { describe, expect, it } from 'vitest';
import {
  mapAccountOptions,
  mapGroupedCategories,
  mapTransactions,
  toAmountCents,
  toIsoDate,
} from './mappers';

describe('finance mappers', () => {
  it('maps account options using id + label', () => {
    const options = mapAccountOptions([
      {
        id: 'acc-1',
        userId: 'u1',
        name: 'Carteira',
        type: 'cash',
        currency: 'BRL',
        openingBalanceCents: 0,
        institution: null,
        isArchived: false,
        archivedAt: null,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
    ]);

    expect(options).toEqual([{ id: 'acc-1', label: 'Carteira' }]);
  });

  it('groups active subcategories under active categories', () => {
    const categories = mapGroupedCategories(
      [
        {
          id: 'cat-1',
          userId: 'u1',
          name: 'Transporte',
          type: 'expense',
          isArchived: false,
          createdAt: '',
          updatedAt: '',
        },
      ],
      [
        {
          id: 'sub-1',
          userId: 'u1',
          categoryId: 'cat-1',
          name: 'Uber',
          isArchived: false,
          createdAt: '',
          updatedAt: '',
        },
      ],
    );

    const firstCategory = categories[0];
    expect(firstCategory).toBeDefined();
    expect(firstCategory!.subcategories).toHaveLength(1);
    expect(firstCategory!.subcategories[0]!.name).toBe('Uber');
  });

  it('maps transaction account display by account id', () => {
    const mapped = mapTransactions(
      [
        {
          id: 'tx-1',
          userId: 'u1',
          accountId: 'acc-1',
          categoryId: 'cat-1',
          subcategoryId: 'sub-1',
          type: 'expense',
          amountCents: 1050,
          note: 'Café',
          isInstallment: false,
          installmentNumber: null,
          installmentTotal: null,
          installmentGroupId: null,
          occurredAt: '2026-01-20T12:00:00.000Z',
          createdAt: '',
          updatedAt: '',
        },
      ],
      [
        {
          id: 'acc-1',
          userId: 'u1',
          name: 'Nubank',
          type: 'checking',
          currency: 'BRL',
          openingBalanceCents: 0,
          institution: null,
          isArchived: false,
          archivedAt: null,
          createdAt: '',
          updatedAt: '',
        },
      ],
    );

    const firstMapped = mapped[0];
    expect(firstMapped).toBeDefined();
    expect(firstMapped!.accountId).toBe('acc-1');
    expect(firstMapped!.accountName).toBe('Nubank');
  });

  it('converts amount and iso date consistently', () => {
    expect(toAmountCents(12.34)).toBe(1234);
    expect(toIsoDate('2026-04-06')).toContain('2026-04-06T12:00:00.000Z');
  });
});
