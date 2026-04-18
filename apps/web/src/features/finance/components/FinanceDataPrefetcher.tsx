import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  accountsQueries,
  categoriesQueries,
  financeQueryKeys,
  subcategoriesQueries,
  transactionsQueries,
} from '@/features/finance/api';
import {
  shouldResetFinancePrefetch,
  shouldRunFinancePrefetch,
} from '@/features/finance/model/prefetch';

type FinanceDataPrefetcherProps = {
  isAuthenticated: boolean;
  isAuthLoading: boolean;
};

export function FinanceDataPrefetcher({
  isAuthenticated,
  isAuthLoading,
}: FinanceDataPrefetcherProps) {
  const queryClient = useQueryClient();
  const hasPrefetchedRef = useRef(false);

  useEffect(() => {
    if (!shouldResetFinancePrefetch(isAuthenticated)) {
      return;
    }

    hasPrefetchedRef.current = false;
    queryClient.removeQueries({ queryKey: financeQueryKeys.root });
  }, [isAuthenticated, queryClient]);

  useEffect(() => {
    const canRunPrefetch = shouldRunFinancePrefetch({
      isAuthLoading,
      isAuthenticated,
      hasPrefetched: hasPrefetchedRef.current,
    });

    if (!canRunPrefetch) {
      return;
    }

    hasPrefetchedRef.current = true;

    void Promise.all([
      queryClient.prefetchQuery(accountsQueries.list()),
      queryClient.prefetchQuery(categoriesQueries.list()),
      queryClient.prefetchQuery(subcategoriesQueries.list()),
      queryClient.prefetchQuery(transactionsQueries.list()),
    ]).catch(() => {
      // Prefetch is best effort; module handles errors on regular load.
    });
  }, [isAuthLoading, isAuthenticated, queryClient]);

  return null;
}
