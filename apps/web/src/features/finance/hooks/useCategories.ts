import { useCallback, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createCategory,
  deleteCategory as deleteCategoryRequest,
  listCategories,
  updateCategory as updateCategoryRequest,
} from '@/api/categories';
import { financeKeys } from '@/api/queryKeys';
import type { MutationResult } from '@/features/finance/types';
import type { CategoryBase, TransactionType } from '@/types/finance';
import { isConflictError } from './errors';

export type CreateCategoryOutcome =
  | { status: 'duplicate' }
  | { status: 'success'; category: CategoryBase };

export function useCategories() {
  const queryClient = useQueryClient();

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

  const categories = useMemo(
    () => categoriesQuery.data ?? [],
    [categoriesQuery.data],
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

  return {
    categories,
    createCategory: createCategoryByName,
    updateCategory,
    deleteCategory,
    isLoading: categoriesQuery.isLoading,
    error: categoriesQuery.error,
  };
}
