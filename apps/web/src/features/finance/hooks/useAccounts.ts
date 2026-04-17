import { useCallback, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { mapAccountOptions, toAmountCents } from '@/features/finance/mappers';
import {
  accountsKeys,
  accountsQueries,
  accountsService,
  invalidateQueryKeys,
} from '@/features/finance/services';
import type { MutationResult } from '@/features/finance/types';
import type { AccountType } from '@/types/finance';
import { isConflictError } from './errors';

export type AddAccountInput = {
  name: string;
  type: AccountType;
  institution?: string;
  openingBalance?: number;
};

export function useAccounts() {
  const queryClient = useQueryClient();

  const accountsQuery = useQuery(accountsQueries.list());

  const createAccountMutation = useMutation({
    mutationFn: accountsService.create,
    onSuccess: () => {
      return invalidateQueryKeys(queryClient, [accountsKeys.all]);
    },
  });

  const accounts = useMemo(() => accountsQuery.data ?? [], [accountsQuery.data]);

  const activeAccounts = useMemo(
    () =>
      accounts
        .filter(account => !account.isArchived)
        .sort((a, b) => a.name.localeCompare(b.name)),
    [accounts],
  );

  const accountOptions = useMemo(
    () => mapAccountOptions(activeAccounts),
    [activeAccounts],
  );

  const addAccount = useCallback(
    async (input: AddAccountInput): Promise<MutationResult> => {
      try {
        await createAccountMutation.mutateAsync({
          name: input.name.trim(),
          type: input.type,
          currency: 'BRL',
          openingBalanceCents: toAmountCents(Math.max(0, input.openingBalance || 0)),
          institution: input.institution?.trim() || undefined,
        });

        return 'success';
      } catch (error) {
        if (isConflictError(error)) {
          return 'duplicate';
        }

        throw error;
      }
    },
    [createAccountMutation],
  );

  return {
    accounts,
    activeAccounts,
    accountOptions,
    addAccount,
    isLoading: accountsQuery.isLoading,
    hasFetched: accountsQuery.isFetched,
    error: accountsQuery.error,
  };
}
