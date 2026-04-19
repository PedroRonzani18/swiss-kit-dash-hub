import { useCallback, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  mapTransactions,
  toAmountCents,
  toIsoDate,
} from '@/features/finance/mappers';
import {
  transactionsApi,
  invalidateQueryKeys,
  transactionsKeys,
  transactionsQueries,
} from '@/features/finance/api';
import type { TransactionDraft } from '@/features/finance/types';
import type {
  Account,
  CreateTransactionInput,
  UpdateTransactionInput,
} from '@/types/finance';

type UseTransactionsOptions = {
  accounts?: Account[];
};

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

export function useTransactions(options: UseTransactionsOptions = {}) {
  const { accounts = [] } = options;
  const queryClient = useQueryClient();

  const transactionsQuery = useQuery(transactionsQueries.list());

  const createTransactionMutation = useMutation({
    mutationFn: transactionsApi.create,
    onSuccess: () => {
      return invalidateQueryKeys(queryClient, [transactionsKeys.all]);
    },
  });

  const bulkCreateTransactionMutation = useMutation({
    mutationFn: transactionsApi.bulkCreate,
    onSuccess: () => {
      return invalidateQueryKeys(queryClient, [transactionsKeys.all]);
    },
  });

  const updateTransactionMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTransactionInput }) =>
      transactionsApi.update(id, payload),
    onSuccess: () => {
      return invalidateQueryKeys(queryClient, [transactionsKeys.all]);
    },
  });

  const deleteTransactionMutation = useMutation({
    mutationFn: transactionsApi.remove,
    onSuccess: () => {
      return invalidateQueryKeys(queryClient, [transactionsKeys.all]);
    },
  });

  const rawTransactions = useMemo(
    () => transactionsQuery.data ?? [],
    [transactionsQuery.data],
  );

  const transactions = useMemo(
    () => mapTransactions(rawTransactions, accounts),
    [rawTransactions, accounts],
  );

  const addTransaction = useCallback(
    async (transaction: TransactionDraft): Promise<void> => {
      await createTransactionMutation.mutateAsync(toTransactionPayload(transaction));
    },
    [createTransactionMutation],
  );

  const bulkAddTransactions = useCallback(
    async (transactions: TransactionDraft[]): Promise<void> => {
      await bulkCreateTransactionMutation.mutateAsync(
        transactions.map(toTransactionPayload),
      );
    },
    [bulkCreateTransactionMutation],
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
    rawTransactions,
    transactions,
    addTransaction,
    bulkAddTransactions,
    updateTransaction,
    deleteTransaction,
    isLoading: transactionsQuery.isLoading,
    hasFetched: transactionsQuery.isFetched,
    error: transactionsQuery.error,
  };
}
