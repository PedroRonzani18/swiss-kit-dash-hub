import { queryOptions } from '@tanstack/react-query';
import {
  createAccount as createAccountRequest,
  deleteAccount as deleteAccountRequest,
  listAccounts as listAccountsRequest,
  updateAccount as updateAccountRequest,
} from '@/api/accounts';
import { financeKeys } from '@/api/queryKeys';

export const accountsKeys = {
  all: () => financeKeys.accounts(),
};

export const accountsService = {
  list: listAccountsRequest,
  create: createAccountRequest,
  update: updateAccountRequest,
  remove: deleteAccountRequest,
};

export const accountsQueries = {
  list: () =>
    queryOptions({
      queryKey: accountsKeys.all(),
      queryFn: accountsService.list,
    }),
};
