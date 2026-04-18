type FinanceResourceStatus = {
  hasFetched: boolean;
  error: unknown;
};

export type FinanceDashboardStatusInput = {
  accounts: FinanceResourceStatus;
  categories: FinanceResourceStatus;
  transactions: FinanceResourceStatus;
};

export type FinanceDashboardStatus = {
  isInitialLoading: boolean;
  error: unknown;
};

export function getFinanceDashboardStatus({
  accounts,
  categories,
  transactions,
}: FinanceDashboardStatusInput): FinanceDashboardStatus {
  const hasFetchedAll =
    accounts.hasFetched &&
    categories.hasFetched &&
    transactions.hasFetched;

  const error = accounts.error || categories.error || transactions.error;

  return {
    isInitialLoading: !hasFetchedAll,
    error,
  };
}
