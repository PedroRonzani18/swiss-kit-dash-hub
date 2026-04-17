import { queryOptions } from '@tanstack/react-query';
import {
  createTransaction as createTransactionRequest,
  deleteTransaction as deleteTransactionRequest,
  listTransactions as listTransactionsRequest,
  updateTransaction as updateTransactionRequest,
} from '@/api/transactions';
import { financeKeys } from '@/api/queryKeys';

export const transactionsKeys = {
  all: () => financeKeys.transactions(),
};

export const transactionsService = {
  list: listTransactionsRequest,
  create: createTransactionRequest,
  update: updateTransactionRequest,
  remove: deleteTransactionRequest,
};

export const transactionsQueries = {
  list: () =>
    queryOptions({
      queryKey: transactionsKeys.all(),
      queryFn: transactionsService.list,
    }),
};
