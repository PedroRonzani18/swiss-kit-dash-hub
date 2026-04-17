import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/auth";
import {
  accountsQueries,
  categoriesQueries,
  subcategoriesQueries,
  transactionsQueries,
} from "@/features/finance/services";

export function FinanceDataPrefetcher() {
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const hasPrefetchedRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) {
      hasPrefetchedRef.current = false;
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthLoading || !isAuthenticated || hasPrefetchedRef.current) {
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
