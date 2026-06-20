import { FinanceDataPrefetcher } from './components/FinanceDataPrefetcher';
import { FinanceDashboardPage } from './components/dashboard';
import { useAuth } from '@/auth';

export function FinanceModuleContent() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  return (
    <>
      <FinanceDataPrefetcher
        isAuthenticated={isAuthenticated}
        isAuthLoading={isAuthLoading}
      />
      <FinanceDashboardPage />
    </>
  );
}
