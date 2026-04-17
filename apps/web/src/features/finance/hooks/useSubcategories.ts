import { useCallback, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  invalidateQueryKeys,
  subcategoriesKeys,
  subcategoriesQueries,
  subcategoriesService,
  transactionsKeys,
} from '@/features/finance/services';
import type { MutationResult } from '@/features/finance/types';
import { isConflictError } from './errors';

export function useSubcategories() {
  const queryClient = useQueryClient();

  const subcategoriesQuery = useQuery(subcategoriesQueries.list());

  const createSubcategoryMutation = useMutation({
    mutationFn: subcategoriesService.create,
    onSuccess: () => {
      return invalidateQueryKeys(queryClient, [subcategoriesKeys.all]);
    },
  });

  const updateSubcategoryMutation = useMutation({
    mutationFn: ({ subId, name }: { subId: string; name: string }) =>
      subcategoriesService.update(subId, { name }),
    onSuccess: () => {
      return invalidateQueryKeys(queryClient, [subcategoriesKeys.all]);
    },
  });

  const deleteSubcategoryMutation = useMutation({
    mutationFn: subcategoriesService.remove,
    onSuccess: () => {
      return invalidateQueryKeys(queryClient, [
        subcategoriesKeys.all,
        transactionsKeys.all,
      ]);
    },
  });

  const subcategories = useMemo(
    () => subcategoriesQuery.data ?? [],
    [subcategoriesQuery.data],
  );

  const createSubcategoryByName = useCallback(
    async (categoryId: string, subcategoryName: string): Promise<MutationResult> => {
      try {
        await createSubcategoryMutation.mutateAsync({
          categoryId,
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
    [createSubcategoryMutation],
  );

  const updateSubcategory = useCallback(
    async (subId: string, newName: string): Promise<MutationResult> => {
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
    async (subId: string): Promise<void> => {
      await deleteSubcategoryMutation.mutateAsync(subId);
    },
    [deleteSubcategoryMutation],
  );

  return {
    subcategories,
    createSubcategory: createSubcategoryByName,
    updateSubcategory,
    deleteSubcategory,
    isLoading: subcategoriesQuery.isLoading,
    hasFetched: subcategoriesQuery.isFetched,
    error: subcategoriesQuery.error,
  };
}
