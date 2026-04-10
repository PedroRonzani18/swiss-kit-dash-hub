import { useCallback, useMemo } from 'react';
import { mapGroupedCategories, mapTransactions } from '@/features/finance/mappers';
import type { MutationResult, TransactionDraft } from '@/features/finance/types';
import type { TransactionType } from '@/types/finance';
import { useAccounts, type AddAccountInput } from './useAccounts';
import { useCategories } from './useCategories';
import { useSubcategories } from './useSubcategories';
import { useTransactions } from './useTransactions';

export type FinanceDashboardData = {
  accounts: ReturnType<typeof useAccounts>['accountOptions'];
  accountItems: ReturnType<typeof useAccounts>['activeAccounts'];
  categories: ReturnType<typeof mapGroupedCategories>;
  transactions: ReturnType<typeof mapTransactions>;
  isLoading: boolean;
  error: unknown;
  addAccount: (input: AddAccountInput) => Promise<MutationResult>;
  addCategory: (
    categoryName: string,
    subcategoryName: string,
    type?: TransactionType,
  ) => Promise<MutationResult>;
  updateCategory: (id: string, newName: string) => Promise<MutationResult>;
  deleteCategory: (id: string) => Promise<void>;
  updateSubcategory: (
    catId: string,
    subId: string,
    newName: string,
  ) => Promise<MutationResult>;
  deleteSubcategory: (catId: string, subId: string) => Promise<void>;
  addTransaction: (transaction: TransactionDraft) => Promise<void>;
  updateTransaction: (id: string, transaction: TransactionDraft) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  getCategoryName: (id: string) => string;
  getSubcategoryName: (catId: string, subId: string) => string;
};

export function useFinanceDashboardData(): FinanceDashboardData {
  const {
    accounts,
    activeAccounts,
    accountOptions,
    addAccount,
    isLoading: isAccountsLoading,
    error: accountsError,
  } = useAccounts();
  const {
    categories: baseCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useCategories();
  const {
    subcategories,
    createSubcategory,
    updateSubcategory: updateSubcategoryById,
    deleteSubcategory: deleteSubcategoryById,
    isLoading: isSubcategoriesLoading,
    error: subcategoriesError,
  } = useSubcategories();
  const {
    transactions: rawTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    isLoading: isTransactionsLoading,
    error: transactionsError,
  } = useTransactions();

  const categories = useMemo(
    () => mapGroupedCategories(baseCategories, subcategories),
    [baseCategories, subcategories],
  );

  const transactions = useMemo(
    () => mapTransactions(rawTransactions, accounts),
    [rawTransactions, accounts],
  );

  const addCategory = useCallback(
    async (
      categoryName: string,
      subcategoryName: string,
      type: TransactionType = 'expense',
    ): Promise<MutationResult> => {
      const normalizedCategoryName = categoryName.trim().toLowerCase();
      const normalizedSubcategoryName = subcategoryName.trim().toLowerCase();

      const existingCategory = categories.find(
        category =>
          category.name.toLowerCase() === normalizedCategoryName && category.type === type,
      );

      if (existingCategory) {
        const duplicateSubcategory = existingCategory.subcategories.some(
          subcategory => subcategory.name.toLowerCase() === normalizedSubcategoryName,
        );

        if (duplicateSubcategory) {
          return 'duplicate';
        }

        return createSubcategory(existingCategory.id, subcategoryName);
      }

      const createdCategory = await createCategory(categoryName, type);

      if (createdCategory.status === 'duplicate') {
        return 'duplicate';
      }

      return createSubcategory(createdCategory.category.id, subcategoryName);
    },
    [categories, createCategory, createSubcategory],
  );

  const updateSubcategory = useCallback(
    async (
      _catId: string,
      subId: string,
      newName: string,
    ): Promise<MutationResult> => updateSubcategoryById(subId, newName),
    [updateSubcategoryById],
  );

  const deleteSubcategory = useCallback(
    async (_catId: string, subId: string): Promise<void> => deleteSubcategoryById(subId),
    [deleteSubcategoryById],
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
    isAccountsLoading ||
    isCategoriesLoading ||
    isSubcategoriesLoading ||
    isTransactionsLoading;

  const error =
    accountsError ||
    categoriesError ||
    subcategoriesError ||
    transactionsError;

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
