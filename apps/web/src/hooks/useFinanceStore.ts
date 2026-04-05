import { useCallback, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '@/types/api';
import type {
  Account,
  Category,
  CategoryBase,
  Subcategory,
  Transaction,
  TransactionResource,
  TransactionType,
} from '@/types/finance';
import {
  createCategory,
  deleteCategory as deleteCategoryRequest,
  listCategories,
  updateCategory as updateCategoryRequest,
} from '@/api/categories';
import {
  createSubcategory,
  deleteSubcategory as deleteSubcategoryRequest,
  listSubcategories,
  updateSubcategory as updateSubcategoryRequest,
} from '@/api/subcategories';
import {
  createTransaction,
  deleteTransaction as deleteTransactionRequest,
  listTransactions,
  updateTransaction as updateTransactionRequest,
} from '@/api/transactions';
import { listAccounts } from '@/api/accounts';
import { financeKeys } from '@/api/queryKeys';

const DAY_ANCHOR_TIME = 'T12:00:00.000Z';

function isConflictError(error: unknown): boolean {
  return error instanceof ApiError && error.status === 409;
}

function toDateOnly(isoDate: string): string {
  return isoDate.slice(0, 10);
}

function toIsoDate(date: string): string {
  return new Date(`${date}${DAY_ANCHOR_TIME}`).toISOString();
}

function toAmountCents(amount: number): number {
  return Math.round(amount * 100);
}

function toAmountFromCents(amountCents: number): number {
  return amountCents / 100;
}

function mapGroupedCategories(
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

function mapTransactions(
  transactions: TransactionResource[],
  accounts: Account[],
): Transaction[] {
  const accountById = new Map(accounts.map(account => [account.id, account.name]));

  return transactions.map(transaction => ({
    id: transaction.id,
    account: accountById.get(transaction.accountId) || 'Conta removida',
    accountId: transaction.accountId,
    date: toDateOnly(transaction.occurredAt),
    description: transaction.note || '',
    amount: toAmountFromCents(transaction.amountCents),
    type: transaction.type,
    categoryId: transaction.categoryId,
    subcategoryId: transaction.subcategoryId || '',
  }));
}

export function useFinanceStore() {
  const queryClient = useQueryClient();

  const accountsQuery = useQuery({
    queryKey: financeKeys.accounts(),
    queryFn: listAccounts,
  });

  const categoriesQuery = useQuery({
    queryKey: financeKeys.categories(),
    queryFn: listCategories,
  });

  const subcategoriesQuery = useQuery({
    queryKey: financeKeys.subcategories(),
    queryFn: listSubcategories,
  });

  const transactionsQuery = useQuery({
    queryKey: financeKeys.transactions(),
    queryFn: listTransactions,
  });

  const createCategoryMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: financeKeys.categories() });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      updateCategoryRequest(id, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: financeKeys.categories() });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategoryRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: financeKeys.categories() });
      queryClient.invalidateQueries({ queryKey: financeKeys.subcategories() });
      queryClient.invalidateQueries({ queryKey: financeKeys.transactions() });
    },
  });

  const createSubcategoryMutation = useMutation({
    mutationFn: createSubcategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: financeKeys.subcategories() });
    },
  });

  const updateSubcategoryMutation = useMutation({
    mutationFn: ({
      subId,
      name,
    }: {
      subId: string;
      name: string;
    }) => updateSubcategoryRequest(subId, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: financeKeys.subcategories() });
    },
  });

  const deleteSubcategoryMutation = useMutation({
    mutationFn: deleteSubcategoryRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: financeKeys.subcategories() });
      queryClient.invalidateQueries({ queryKey: financeKeys.transactions() });
    },
  });

  const createTransactionMutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: financeKeys.transactions() });
    },
  });

  const updateTransactionMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: {
        type: TransactionType;
        amountCents: number;
        accountId: string;
        categoryId: string;
        subcategoryId: string | null;
        occurredAt: string;
        note: string;
      };
    }) => updateTransactionRequest(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: financeKeys.transactions() });
    },
  });

  const deleteTransactionMutation = useMutation({
    mutationFn: deleteTransactionRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: financeKeys.transactions() });
    },
  });

  const accounts = accountsQuery.data || [];
  const categories = useMemo(
    () => mapGroupedCategories(categoriesQuery.data || [], subcategoriesQuery.data || []),
    [categoriesQuery.data, subcategoriesQuery.data],
  );

  const transactions = useMemo(
    () => mapTransactions(transactionsQuery.data || [], accounts),
    [transactionsQuery.data, accounts],
  );

  const accountNames = useMemo(
    () => accounts.filter(account => !account.isArchived).map(account => account.name),
    [accounts],
  );

  const addCategory = useCallback(
    async (
      categoryName: string,
      subcategoryName: string,
      type: TransactionType = 'expense',
    ): Promise<'duplicate' | 'success'> => {
      const normalizedCategoryName = categoryName.trim().toLowerCase();
      const normalizedSubcategoryName = subcategoryName.trim().toLowerCase();

      const existingCategory = categories.find(
        category =>
          category.name.toLowerCase() === normalizedCategoryName && category.type === type,
      );

      if (existingCategory) {
        const duplicateSubcategory = existingCategory.subcategories.some(
          subcategory =>
            subcategory.name.toLowerCase() === normalizedSubcategoryName,
        );

        if (duplicateSubcategory) {
          return 'duplicate';
        }

        try {
          await createSubcategoryMutation.mutateAsync({
            categoryId: existingCategory.id,
            name: subcategoryName.trim(),
          });
          return 'success';
        } catch (error) {
          if (isConflictError(error)) {
            return 'duplicate';
          }
          throw error;
        }
      }

      try {
        const createdCategory = await createCategoryMutation.mutateAsync({
          name: categoryName.trim(),
          type,
        });

        await createSubcategoryMutation.mutateAsync({
          categoryId: createdCategory.id,
          name: subcategoryName.trim(),
        });

        return 'success';
      } catch (error) {
        if (isConflictError(error)) {
          return 'duplicate';
        }
        throw error;
      }
    },
    [
      categories,
      createCategoryMutation,
      createSubcategoryMutation,
    ],
  );

  const updateCategory = useCallback(
    async (id: string, newName: string): Promise<'duplicate' | 'success'> => {
      try {
        await updateCategoryMutation.mutateAsync({
          id,
          name: newName.trim(),
        });

        return 'success';
      } catch (error) {
        if (isConflictError(error)) {
          return 'duplicate';
        }
        throw error;
      }
    },
    [updateCategoryMutation],
  );

  const deleteCategory = useCallback(
    async (id: string): Promise<void> => {
      const relatedTransactions = transactions.filter(
        transaction => transaction.categoryId === id,
      );

      await Promise.all(
        relatedTransactions.map(transaction =>
          deleteTransactionMutation.mutateAsync(transaction.id),
        ),
      );

      await deleteCategoryMutation.mutateAsync(id);
    },
    [transactions, deleteCategoryMutation, deleteTransactionMutation],
  );

  const updateSubcategory = useCallback(
    async (
      _catId: string,
      subId: string,
      newName: string,
    ): Promise<'duplicate' | 'success'> => {
      try {
        await updateSubcategoryMutation.mutateAsync({
          subId,
          name: newName.trim(),
        });

        return 'success';
      } catch (error) {
        if (isConflictError(error)) {
          return 'duplicate';
        }
        throw error;
      }
    },
    [updateSubcategoryMutation],
  );

  const deleteSubcategory = useCallback(
    async (_catId: string, subId: string): Promise<void> => {
      const relatedTransactions = transactions.filter(
        transaction => transaction.subcategoryId === subId,
      );

      await Promise.all(
        relatedTransactions.map(transaction =>
          deleteTransactionMutation.mutateAsync(transaction.id),
        ),
      );

      await deleteSubcategoryMutation.mutateAsync(subId);
    },
    [transactions, deleteSubcategoryMutation, deleteTransactionMutation],
  );

  const addTransaction = useCallback(
    async (transaction: Omit<Transaction, 'id'>): Promise<void> => {
      const account = accounts.find(item => item.name === transaction.account);
      if (!account) {
        throw new Error('Conta selecionada não encontrada.');
      }

      await createTransactionMutation.mutateAsync({
        type: transaction.type,
        amountCents: toAmountCents(transaction.amount),
        accountId: account.id,
        categoryId: transaction.categoryId,
        subcategoryId: transaction.subcategoryId || null,
        occurredAt: toIsoDate(transaction.date),
        note: transaction.description,
      });
    },
    [accounts, createTransactionMutation],
  );

  const updateTransaction = useCallback(
    async (id: string, data: Omit<Transaction, 'id'>): Promise<void> => {
      const account = accounts.find(item => item.name === data.account);
      if (!account) {
        throw new Error('Conta selecionada não encontrada.');
      }

      await updateTransactionMutation.mutateAsync({
        id,
        payload: {
          type: data.type,
          amountCents: toAmountCents(data.amount),
          accountId: account.id,
          categoryId: data.categoryId,
          subcategoryId: data.subcategoryId || null,
          occurredAt: toIsoDate(data.date),
          note: data.description,
        },
      });
    },
    [accounts, updateTransactionMutation],
  );

  const deleteTransaction = useCallback(
    async (id: string): Promise<void> => {
      await deleteTransactionMutation.mutateAsync(id);
    },
    [deleteTransactionMutation],
  );

  const getCategoryName = useCallback(
    (id: string) => categories.find(category => category.id === id)?.name ?? '',
    [categories],
  );

  const getSubcategoryName = useCallback(
    (catId: string, subId: string) => {
      if (!subId) {
        return '';
      }

      return (
        categories
          .find(category => category.id === catId)
          ?.subcategories.find(subcategory => subcategory.id === subId)?.name ?? ''
      );
    },
    [categories],
  );

  const isLoading =
    accountsQuery.isLoading ||
    categoriesQuery.isLoading ||
    subcategoriesQuery.isLoading ||
    transactionsQuery.isLoading;

  const error =
    accountsQuery.error ||
    categoriesQuery.error ||
    subcategoriesQuery.error ||
    transactionsQuery.error;

  return {
    accounts: accountNames,
    categories,
    transactions,
    isLoading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    updateSubcategory,
    deleteSubcategory,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getCategoryName,
    getSubcategoryName,
  };
}
