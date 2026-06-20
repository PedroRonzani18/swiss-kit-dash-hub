import type {
  Account,
  AccountOption,
  Category,
  CategoryBase,
  Subcategory,
  Transaction,
  TransactionResource,
} from '@/types/finance';

export const DAY_ANCHOR_TIME = 'T12:00:00.000Z';

export function toDateOnly(isoDate: string): string {
  return isoDate.slice(0, 10);
}

export function toIsoDate(date: string): string {
  return new Date(`${date}${DAY_ANCHOR_TIME}`).toISOString();
}

export function toAmountCents(amount: number): number {
  return Math.round(amount * 100);
}

export function toAmountFromCents(amountCents: number): number {
  return amountCents / 100;
}

export function mapAccountOptions(accounts: Account[]): AccountOption[] {
  return accounts.map(account => ({ id: account.id, label: account.name }));
}

export function mapGroupedCategories(
  baseCategories: CategoryBase[],
  subcategories: Subcategory[],
): Category[] {
  const subByCategory = new Map<string, Subcategory[]>();

  subcategories
    .filter(sub => !sub.isArchived)
    .forEach(sub => {
      const existing = subByCategory.get(sub.categoryId) || [];
      existing.push(sub);
      subByCategory.set(sub.categoryId, existing);
    });

  return baseCategories
    .filter(category => !category.isArchived)
    .map(category => ({
      ...category,
      subcategories: (subByCategory.get(category.id) || []).sort((a, b) =>
        a.name.localeCompare(b.name),
      ),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function mapTransactions(
  transactions: TransactionResource[],
  accounts: Account[],
): Transaction[] {
  const accountById = new Map(accounts.map(account => [account.id, account.name]));

  return transactions.map(transaction => ({
    id: transaction.id,
    accountId: transaction.accountId,
    accountName: accountById.get(transaction.accountId) || 'Conta removida',
    date: toDateOnly(transaction.occurredAt),
    description: transaction.note || '',
    amount: toAmountFromCents(transaction.amountCents),
    type: transaction.type,
    categoryId: transaction.categoryId,
    subcategoryId: transaction.subcategoryId || '',
    isInstallment: transaction.isInstallment,
    installmentNumber: transaction.installmentNumber,
    installmentTotal: transaction.installmentTotal,
    installmentGroupId: transaction.installmentGroupId,
  }));
}
