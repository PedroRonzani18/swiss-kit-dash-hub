import { queryOptions } from "@tanstack/react-query";
import {
  transactionResourceListSchema,
  transactionResourceSchema,
} from "@swisskit/contracts";
import { apiClient } from "@/api/client";
import { parseApiResponse } from "@/api/validation";
import type {
  CreateTransactionInput,
  TransactionResource,
  UpdateTransactionInput,
} from "@/types/finance";
import { financeQueryKeys } from "./queryKeys";

export const transactionsKeys = {
  all: () => financeQueryKeys.transactions(),
};

async function listTransactions(): Promise<TransactionResource[]> {
  const data = await apiClient.get<unknown>("/transactions");
  return parseApiResponse(transactionResourceListSchema, data) as TransactionResource[];
}

async function createTransaction(
  input: CreateTransactionInput,
): Promise<TransactionResource> {
  const data = await apiClient.post<unknown, CreateTransactionInput>(
    "/transactions",
    input,
  );
  return parseApiResponse(transactionResourceSchema, data) as TransactionResource;
}

async function updateTransaction(
  id: string,
  input: UpdateTransactionInput,
): Promise<TransactionResource> {
  const data = await apiClient.patch<unknown, UpdateTransactionInput>(
    `/transactions/${id}`,
    input,
  );
  return parseApiResponse(transactionResourceSchema, data) as TransactionResource;
}

async function deleteTransaction(id: string): Promise<void> {
  return apiClient.delete(`/transactions/${id}`);
}

export type TransactionsApi = {
  list: typeof listTransactions;
  create: typeof createTransaction;
  update: typeof updateTransaction;
  remove: typeof deleteTransaction;
};

export const transactionsApi: TransactionsApi = {
  list: listTransactions,
  create: createTransaction,
  update: updateTransaction,
  remove: deleteTransaction,
};

export const transactionsQueries = {
  list: () =>
    queryOptions({
      queryKey: transactionsKeys.all(),
      queryFn: transactionsApi.list,
    }),
};
