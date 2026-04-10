import { useCallback, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createAccount, listAccounts } from '@/api/accounts';
import { financeKeys } from '@/api/queryKeys';
import { mapAccountOptions, toAmountCents } from '@/features/finance/mappers';
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

  const accountsQuery = useQuery({
    queryKey: financeKeys.accounts(),
    queryFn: listAccounts,
  });

  const createAccountMutation = useMutation({
    mutationFn: createAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: financeKeys.accounts() });
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
    error: accountsQuery.error,
  };
}
