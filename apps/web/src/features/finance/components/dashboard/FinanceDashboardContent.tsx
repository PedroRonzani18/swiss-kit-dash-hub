import type { FinanceDashboardData } from '@/features/finance/hooks';
import type { FinanceTabRoute } from '@/features/finance/navigation';
import type { Transaction } from '@/types/finance';
import { FinanceDashboardHeader } from './FinanceDashboardHeader';
import { FinanceDashboardTabs } from './FinanceDashboardTabs';

type FinanceDashboardContentProps = {
  activeTab: FinanceTabRoute;
  onTabChange: (tab: FinanceTabRoute) => void;
  accounts: FinanceDashboardData['accounts'];
  categories: FinanceDashboardData['categories'];
  transactions: FinanceDashboardData['transactions'];
  onOpenNewTransaction: () => void;
  onEditTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (id: string) => Promise<void>;
};

export function FinanceDashboardContent({
  activeTab,
  onTabChange,
  accounts,
  categories,
  transactions,
  onOpenNewTransaction,
  onEditTransaction,
  onDeleteTransaction,
}: FinanceDashboardContentProps) {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <FinanceDashboardHeader onOpenNewTransaction={onOpenNewTransaction} />

      <FinanceDashboardTabs
        activeTab={activeTab}
        onTabChange={onTabChange}
        accountOptions={accounts.accountOptions}
        accountItems={accounts.activeAccounts}
        categories={categories.categories}
        transactions={transactions.transactions}
        addAccount={accounts.addAccount}
        addCategory={categories.addCategory}
        updateCategory={categories.updateCategory}
        deleteCategory={categories.deleteCategory}
        updateSubcategory={categories.updateSubcategory}
        deleteSubcategory={categories.deleteSubcategory}
        getCategoryName={categories.getCategoryName}
        getSubcategoryName={categories.getSubcategoryName}
        onEditTransaction={onEditTransaction}
        onDeleteTransaction={onDeleteTransaction}
      />
    </div>
  );
}
