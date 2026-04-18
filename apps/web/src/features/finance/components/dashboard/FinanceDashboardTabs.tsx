import {
  AccountManager,
  AdvancedAnalyticsPanel,
  CategoryManager,
  TransactionTable,
} from '@/features/finance/components/management';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { FinanceDashboardData } from '@/features/finance/hooks';
import {
  isFinanceTabRoute,
  type FinanceTabRoute,
} from '@/features/finance/navigation';
import type { Transaction } from '@/types/finance';

type FinanceDashboardTabsProps = {
  activeTab: FinanceTabRoute;
  onTabChange: (tab: FinanceTabRoute) => void;
  finance: FinanceDashboardData;
  onEditTransaction: (transaction: Transaction) => void;
};

export function FinanceDashboardTabs({
  activeTab,
  onTabChange,
  finance,
  onEditTransaction,
}: FinanceDashboardTabsProps) {
  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => {
        if (isFinanceTabRoute(value)) {
          onTabChange(value);
        }
      }}
      className="space-y-4"
    >
      <TabsList>
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="transactions">Transações</TabsTrigger>
        <TabsTrigger value="accounts">Contas</TabsTrigger>
        <TabsTrigger value="categories">Categorias</TabsTrigger>
      </TabsList>

      <TabsContent value="dashboard">
        <AdvancedAnalyticsPanel
          transactions={finance.transactions.transactions}
          categories={finance.categories.categories}
          getCategoryName={finance.categories.getCategoryName}
          getSubcategoryName={finance.categories.getSubcategoryName}
        />
      </TabsContent>

      <TabsContent value="transactions">
        <TransactionTable
          accounts={finance.accounts.accountOptions}
          transactions={finance.transactions.transactions}
          categories={finance.categories.categories}
          getCategoryName={finance.categories.getCategoryName}
          getSubcategoryName={finance.categories.getSubcategoryName}
          onEdit={onEditTransaction}
          onDelete={finance.transactions.deleteTransaction}
        />
      </TabsContent>

      <TabsContent value="accounts">
        <AccountManager
          accounts={finance.accounts.activeAccounts}
          onAddAccount={finance.accounts.addAccount}
        />
      </TabsContent>

      <TabsContent value="categories">
        <CategoryManager
          categories={finance.categories.categories}
          onAddCategory={finance.categories.addCategory}
          onUpdateCategory={finance.categories.updateCategory}
          onDeleteCategory={finance.categories.deleteCategory}
          onUpdateSubcategory={finance.categories.updateSubcategory}
          onDeleteSubcategory={finance.categories.deleteSubcategory}
        />
      </TabsContent>
    </Tabs>
  );
}
