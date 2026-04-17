import { useCallback, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { mapGroupedCategories } from '@/features/finance/mappers';
import {
  categoriesKeys,
  categoriesQueries,
  categoriesService,
  invalidateQueryKeys,
  subcategoriesKeys,
  transactionsKeys,
} from '@/features/finance/services';
import type { MutationResult } from '@/features/finance/types';
import type { CategoryBase, TransactionType } from '@/types/finance';
import { isConflictError } from './errors';
import { useSubcategories } from './useSubcategories';

export type CreateCategoryOutcome =
  | { status: 'duplicate' }
  | { status: 'success'; category: CategoryBase };

export function useCategories() {
  const queryClient = useQueryClient();
  const {
    subcategories,
    createSubcategory,
    updateSubcategory: updateSubcategoryById,
    deleteSubcategory: deleteSubcategoryById,
    isLoading: isSubcategoriesLoading,
    hasFetched: hasSubcategoriesFetched,
    error: subcategoriesError,
  } = useSubcategories();

  const categoriesQuery = useQuery(categoriesQueries.list());

  const createCategoryMutation = useMutation({
    mutationFn: categoriesService.create,
    onSuccess: () => {
      return invalidateQueryKeys(queryClient, [categoriesKeys.all]);
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      categoriesService.update(id, { name }),
    onSuccess: () => {
      return invalidateQueryKeys(queryClient, [categoriesKeys.all]);
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: categoriesService.remove,
    onSuccess: () => {
      return invalidateQueryKeys(queryClient, [
        categoriesKeys.all,
        subcategoriesKeys.all,
        transactionsKeys.all,
      ]);
    },
  });

  const baseCategories = useMemo(
    () => categoriesQuery.data ?? [],
    [categoriesQuery.data],
  );

  const categories = useMemo(
    () => mapGroupedCategories(baseCategories, subcategories),
    [baseCategories, subcategories],
  );

  const createCategoryByName = useCallback(
    async (
      categoryName: string,
      type: TransactionType,
    ): Promise<CreateCategoryOutcome> => {
      try {
        const category = await createCategoryMutation.mutateAsync({
          name: categoryName.trim(),
          type,
        });

        return {
          status: 'success',
          category,
        };
      } catch (error) {
        if (isConflictError(error)) {
          return { status: 'duplicate' };
        }

        throw error;
      }
    },
    [createCategoryMutation],
  );

  const updateCategory = useCallback(
    async (id: string, newName: string): Promise<MutationResult> => {
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
          category.name.toLowerCase() === normalizedCategoryName &&
          category.type === type,
      );

      if (existingCategory) {
        const duplicateSubcategory = existingCategory.subcategories.some(
          subcategory =>
            subcategory.name.toLowerCase() === normalizedSubcategoryName,
        );

        if (duplicateSubcategory) {
          return 'duplicate';
        }

        return createSubcategory(existingCategory.id, subcategoryName);
      }

      const createdCategory = await createCategoryByName(categoryName, type);

      if (createdCategory.status === 'duplicate') {
        return 'duplicate';
      }

      return createSubcategory(createdCategory.category.id, subcategoryName);
    },
    [categories, createCategoryByName, createSubcategory],
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
    async (_catId: string, subId: string): Promise<void> =>
      deleteSubcategoryById(subId),
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
          ?.subcategories.find(subcategory => subcategory.id === subId)?.name ??
        ''
      );
    },
    [categories],
  );

  const isLoading = categoriesQuery.isLoading || isSubcategoriesLoading;
  const hasFetched = categoriesQuery.isFetched && hasSubcategoriesFetched;
  const error = categoriesQuery.error || subcategoriesError;

  return {
    baseCategories,
    subcategories,
    categories,
    addCategory,
    createCategory: createCategoryByName,
    updateCategory,
    deleteCategory,
    updateSubcategory,
    deleteSubcategory,
    getCategoryName,
    getSubcategoryName,
    isLoading,
    hasFetched,
    error,
  };
}
