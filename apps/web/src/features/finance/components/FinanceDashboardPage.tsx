import { AppLayout } from '@/components/AppLayout';
import { useFinanceDashboardData } from '@/features/finance/hooks';
import { FinanceDashboardContent } from './FinanceDashboardContent';
import { FinanceErrorState } from './FinanceErrorState';
import { FinanceLoadingState } from './FinanceLoadingState';

export function FinanceDashboardPage() {
  const finance = useFinanceDashboardData();

  return (
    <AppLayout breadcrumbs={['SwissKit', 'Financeiro']}>
      {finance.isLoading && <FinanceLoadingState />}
      {!finance.isLoading && finance.error && <FinanceErrorState />}
      {!finance.isLoading && !finance.error && (
        <FinanceDashboardContent finance={finance} />
      )}
    </AppLayout>
  );
}
