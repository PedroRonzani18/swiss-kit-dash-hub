import type { FinanceDashboardData } from '@/features/finance/hooks';
import type { Transaction } from '@/types/finance';
import { FinanceDashboardHeader } from './FinanceDashboardHeader';
import { FinanceDashboardTabs } from './FinanceDashboardTabs';

type FinanceDashboardContentProps = {
  accounts: FinanceDashboardData['accounts'];
  categories: FinanceDashboardData['categories'];
  transactions: FinanceDashboardData['transactions'];
  onOpenNewTransaction: () => void;
  onEditTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (id: string) => Promise<void>;
};

export function FinanceDashboardContent({
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
