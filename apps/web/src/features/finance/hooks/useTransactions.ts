import { useCallback, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { financeKeys } from '@/api/queryKeys';
import {
  createTransaction,
  deleteTransaction as deleteTransactionRequest,
  listTransactions,
  updateTransaction as updateTransactionRequest,
} from '@/api/transactions';
import { toAmountCents, toIsoDate } from '@/features/finance/mappers';
import type { TransactionDraft } from '@/features/finance/types';
import type {
  CreateTransactionInput,
  UpdateTransactionInput,
} from '@/types/finance';

function toTransactionPayload(transaction: TransactionDraft): CreateTransactionInput {
  return {
    type: transaction.type,
    amountCents: toAmountCents(transaction.amount),
    accountId: transaction.accountId,
    categoryId: transaction.categoryId,
    subcategoryId: transaction.subcategoryId || null,
    occurredAt: toIsoDate(transaction.date),
    note: transaction.description,
  };
}

export function useTransactions() {
  const queryClient = useQueryClient();

  const transactionsQuery = useQuery({
    queryKey: financeKeys.transactions(),
    queryFn: listTransactions,
  });

  const createTransactionMutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: financeKeys.transactions() });
    },
  });

  const updateTransactionMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTransactionInput }) =>
      updateTransactionRequest(id, payload),
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

  const transactions = useMemo(
    () => transactionsQuery.data ?? [],
    [transactionsQuery.data],
  );

  const addTransaction = useCallback(
    async (transaction: TransactionDraft): Promise<void> => {
      await createTransactionMutation.mutateAsync(toTransactionPayload(transaction));
    },
    [createTransactionMutation],
  );

  const updateTransaction = useCallback(
    async (id: string, transaction: TransactionDraft): Promise<void> => {
      await updateTransactionMutation.mutateAsync({
        id,
        payload: toTransactionPayload(transaction),
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

  return {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    isLoading: transactionsQuery.isLoading,
    error: transactionsQuery.error,
  };
}
