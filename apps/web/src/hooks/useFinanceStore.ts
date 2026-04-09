import { useCallback, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '@/types/api';
import type {
  AccountType,
  Category,
  TransactionType,
} from '@/types/finance';
import type { TransactionDraft } from '@/features/finance/types';
import {
  mapAccountOptions,
  mapGroupedCategories,
  mapTransactions,
  toAmountCents,
  toIsoDate,
} from '@/features/finance/mappers';
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
import { createAccount, listAccounts } from '@/api/accounts';
import { financeKeys } from '@/api/queryKeys';

function isConflictError(error: unknown): boolean {
  return error instanceof ApiError && error.status === 409;
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

  const createAccountMutation = useMutation({
    mutationFn: createAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: financeKeys.accounts() });
    },
  });

  const accounts = useMemo(() => accountsQuery.data ?? [], [accountsQuery.data]);
  const activeAccounts = useMemo(
    () =>
      accounts
        .filter(account => !account.isArchived)
        .sort((a, b) => a.name.localeCompare(b.name)),
    [accounts],
  );

  const accountOptions = useMemo(
    () => mapAccountOptions(activeAccounts),
    [activeAccounts],
  );

  const categories = useMemo<Category[]>(
    () => mapGroupedCategories(categoriesQuery.data || [], subcategoriesQuery.data || []),
    [categoriesQuery.data, subcategoriesQuery.data],
  );

  const transactions = useMemo(
    () => mapTransactions(transactionsQuery.data || [], accounts),
    [transactionsQuery.data, accounts],
  );

  const addAccount = useCallback(
    async (input: {
      name: string;
      type: AccountType;
      institution?: string;
      openingBalance?: number;
    }): Promise<'duplicate' | 'success'> => {
      try {
        await createAccountMutation.mutateAsync({
          name: input.name.trim(),
          type: input.type,
          currency: 'BRL',
          openingBalanceCents: toAmountCents(Math.max(0, input.openingBalance || 0)),
          institution: input.institution?.trim() || undefined,
        });

        return 'success';
      } catch (error) {
        if (isConflictError(error)) {
          return 'duplicate';
        }

        throw error;
      }
    },
    [createAccountMutation],
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
      await deleteCategoryMutation.mutateAsync(id);
    },
    [deleteCategoryMutation],
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
      await deleteSubcategoryMutation.mutateAsync(subId);
    },
    [deleteSubcategoryMutation],
  );

  const addTransaction = useCallback(
    async (transaction: TransactionDraft): Promise<void> => {
      await createTransactionMutation.mutateAsync({
        type: transaction.type,
        amountCents: toAmountCents(transaction.amount),
        accountId: transaction.accountId,
        categoryId: transaction.categoryId,
        subcategoryId: transaction.subcategoryId || null,
        occurredAt: toIsoDate(transaction.date),
        note: transaction.description,
      });
    },
    [createTransactionMutation],
  );

  const updateTransaction = useCallback(
    async (id: string, data: TransactionDraft): Promise<void> => {
      await updateTransactionMutation.mutateAsync({
        id,
        payload: {
          type: data.type,
          amountCents: toAmountCents(data.amount),
          accountId: data.accountId,
          categoryId: data.categoryId,
          subcategoryId: data.subcategoryId || null,
          occurredAt: toIsoDate(data.date),
          note: data.description,
        },
      });
    },
    [updateTransactionMutation],
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
    accounts: accountOptions,
    accountItems: activeAccounts,
    categories,
    transactions,
    isLoading,
    error,
    addAccount,
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
