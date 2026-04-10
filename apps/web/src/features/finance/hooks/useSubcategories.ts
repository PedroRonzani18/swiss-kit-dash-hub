import { useCallback, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createSubcategory,
  deleteSubcategory as deleteSubcategoryRequest,
  listSubcategories,
  updateSubcategory as updateSubcategoryRequest,
} from '@/api/subcategories';
import { financeKeys } from '@/api/queryKeys';
import type { MutationResult } from '@/features/finance/types';
import { isConflictError } from './errors';

export function useSubcategories() {
  const queryClient = useQueryClient();

  const subcategoriesQuery = useQuery({
    queryKey: financeKeys.subcategories(),
    queryFn: listSubcategories,
  });

  const createSubcategoryMutation = useMutation({
    mutationFn: createSubcategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: financeKeys.subcategories() });
    },
  });

  const updateSubcategoryMutation = useMutation({
    mutationFn: ({ subId, name }: { subId: string; name: string }) =>
      updateSubcategoryRequest(subId, { name }),
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
    error: subcategoriesQuery.error,
  };
}
