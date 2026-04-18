import { queryOptions } from "@tanstack/react-query";
import {
  createAccount as createAccountRequest,
  deleteAccount as deleteAccountRequest,
  listAccounts as listAccountsRequest,
  updateAccount as updateAccountRequest,
} from "@/api/accounts";
import { financeQueryKeys } from "./queryKeys";

export const accountsKeys = {
  all: () => financeQueryKeys.accounts(),
};

export type AccountsApi = {
  list: typeof listAccountsRequest;
  create: typeof createAccountRequest;
  update: typeof updateAccountRequest;
  remove: typeof deleteAccountRequest;
};

export const accountsApi: AccountsApi = {
  list: listAccountsRequest,
  create: createAccountRequest,
  update: updateAccountRequest,
  remove: deleteAccountRequest,
};

export const accountsQueries = {
  list: () =>
    queryOptions({
      queryKey: accountsKeys.all(),
      queryFn: accountsApi.list,
    }),
};
