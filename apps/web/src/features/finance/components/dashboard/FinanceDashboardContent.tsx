import type { FinanceDashboardData } from '@/features/finance/hooks';
import type { FinanceTabRoute } from '@/features/finance/navigation';
import type { Transaction } from '@/types/finance';
import { FinanceDashboardHeader } from './FinanceDashboardHeader';
import { FinanceDashboardTabs } from './FinanceDashboardTabs';

type FinanceDashboardContentProps = {
  activeTab: FinanceTabRoute;
  onTabChange: (tab: FinanceTabRoute) => void;
  finance: FinanceDashboardData;
  onOpenNewTransaction: () => void;
  onEditTransaction: (transaction: Transaction) => void;
};

export function FinanceDashboardContent({
  activeTab,
  onTabChange,
  finance,
  onOpenNewTransaction,
  onEditTransaction,
}: FinanceDashboardContentProps) {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <FinanceDashboardHeader onOpenNewTransaction={onOpenNewTransaction} />

      <FinanceDashboardTabs
        activeTab={activeTab}
        onTabChange={onTabChange}
        finance={finance}
        onEditTransaction={onEditTransaction}
      />
    </div>
  );
}
