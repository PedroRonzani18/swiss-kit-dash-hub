import { useAccounts } from './useAccounts';
import { useCategories } from './useCategories';
import { useTransactions } from './useTransactions';

export type FinanceDashboardData = {
  accounts: ReturnType<typeof useAccounts>;
  categories: ReturnType<typeof useCategories>;
  transactions: ReturnType<typeof useTransactions>;
};

export function useFinanceDashboardData(): FinanceDashboardData {
  const accounts = useAccounts();
  const categories = useCategories();
  const transactions = useTransactions({ accounts: accounts.accounts });

  return {
    accounts,
    categories,
    transactions,
  };
}
