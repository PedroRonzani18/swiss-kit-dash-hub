import { useFinanceDashboardData } from '@/features/finance/hooks';

export function useFinanceStore() {
  return useFinanceDashboardData();
}
