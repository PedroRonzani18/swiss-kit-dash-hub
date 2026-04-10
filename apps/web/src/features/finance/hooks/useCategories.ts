import { useCallback, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createCategory,
  deleteCategory as deleteCategoryRequest,
  listCategories,
  updateCategory as updateCategoryRequest,
} from '@/api/categories';
import { financeKeys } from '@/api/queryKeys';
import { mapGroupedCategories } from '@/features/finance/mappers';
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
    error: subcategoriesError,
  } = useSubcategories();

  const categoriesQuery = useQuery({
    queryKey: financeKeys.categories(),
    queryFn: listCategories,
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
    error,
  };
}
