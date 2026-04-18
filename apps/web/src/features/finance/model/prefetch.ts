export type FinancePrefetchGateInput = {
  isAuthLoading: boolean;
  isAuthenticated: boolean;
  hasPrefetched: boolean;
};

export function shouldResetFinancePrefetch(isAuthenticated: boolean): boolean {
  return !isAuthenticated;
}

export function shouldRunFinancePrefetch({
  isAuthLoading,
  isAuthenticated,
  hasPrefetched,
}: FinancePrefetchGateInput): boolean {
  return !isAuthLoading && isAuthenticated && !hasPrefetched;
}
