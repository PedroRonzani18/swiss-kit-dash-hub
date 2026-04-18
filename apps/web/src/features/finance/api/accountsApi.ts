import { queryOptions } from "@tanstack/react-query";
import { accountListSchema, accountSchema } from "@swisskit/contracts";
import { apiClient } from "@/api/client";
import { parseApiResponse } from "@/api/validation";
import type {
  Account,
  CreateAccountInput,
  UpdateAccountInput,
} from "@/types/finance";
import { financeQueryKeys } from "./queryKeys";

export const accountsKeys = {
  all: () => financeQueryKeys.accounts(),
};

async function listAccounts(): Promise<Account[]> {
  const data = await apiClient.get<unknown>("/accounts");
  return parseApiResponse(accountListSchema, data) as Account[];
}

async function createAccount(input: CreateAccountInput): Promise<Account> {
  const data = await apiClient.post<unknown, CreateAccountInput>(
    "/accounts",
    input,
  );
  return parseApiResponse(accountSchema, data) as Account;
}

async function updateAccount(
  id: string,
  input: UpdateAccountInput,
): Promise<Account> {
  const data = await apiClient.patch<unknown, UpdateAccountInput>(
    `/accounts/${id}`,
    input,
  );
  return parseApiResponse(accountSchema, data) as Account;
}

async function deleteAccount(id: string): Promise<void> {
  return apiClient.delete(`/accounts/${id}`);
}

export type AccountsApi = {
  list: typeof listAccounts;
  create: typeof createAccount;
  update: typeof updateAccount;
  remove: typeof deleteAccount;
};

export const accountsApi: AccountsApi = {
  list: listAccounts,
  create: createAccount,
  update: updateAccount,
  remove: deleteAccount,
};

export const accountsQueries = {
  list: () =>
    queryOptions({
      queryKey: accountsKeys.all(),
      queryFn: accountsApi.list,
    }),
};
