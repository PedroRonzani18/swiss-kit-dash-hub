import { queryOptions } from "@tanstack/react-query";
import {
  createTransaction as createTransactionRequest,
  deleteTransaction as deleteTransactionRequest,
  listTransactions as listTransactionsRequest,
  updateTransaction as updateTransactionRequest,
} from "@/api/transactions";
import { financeQueryKeys } from "./queryKeys";

export const transactionsKeys = {
  all: () => financeQueryKeys.transactions(),
};

export type TransactionsApi = {
  list: typeof listTransactionsRequest;
  create: typeof createTransactionRequest;
  update: typeof updateTransactionRequest;
  remove: typeof deleteTransactionRequest;
};

export const transactionsApi: TransactionsApi = {
  list: listTransactionsRequest,
  create: createTransactionRequest,
  update: updateTransactionRequest,
  remove: deleteTransactionRequest,
};

export const transactionsQueries = {
  list: () =>
    queryOptions({
      queryKey: transactionsKeys.all(),
      queryFn: transactionsApi.list,
    }),
};
