import { AccountManager } from '@/components/finance/AccountManager';
import { AdvancedAnalyticsPanel } from '@/components/finance/AdvancedAnalyticsPanel';
import { CategoryManager } from '@/components/finance/CategoryManager';
import { TransactionTable } from '@/components/finance/TransactionTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { AddAccountInput } from '@/features/finance/hooks/useAccounts';
import type { MutationResult } from '@/features/finance/types';
import {
  isFinanceTabRoute,
  type FinanceTabRoute,
} from '@/modules/finance/navigation';
import type {
  Account,
  AccountOption,
  Category,
  Transaction,
  TransactionType,
} from '@/types/finance';

type FinanceDashboardTabsProps = {
  activeTab: FinanceTabRoute;
  onTabChange: (tab: FinanceTabRoute) => void;
  accountOptions: AccountOption[];
  accountItems: Account[];
  categories: Category[];
  transactions: Transaction[];
  addAccount: (input: AddAccountInput) => Promise<MutationResult>;
  addCategory: (
    categoryName: string,
    subcategoryName: string,
    type: TransactionType,
  ) => Promise<MutationResult>;
  updateCategory: (id: string, newName: string) => Promise<MutationResult>;
  deleteCategory: (id: string) => Promise<void>;
  updateSubcategory: (
    catId: string,
    subId: string,
    newName: string,
  ) => Promise<MutationResult>;
  deleteSubcategory: (catId: string, subId: string) => Promise<void>;
  getCategoryName: (id: string) => string;
  getSubcategoryName: (catId: string, subId: string) => string;
  onEditTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (id: string) => Promise<void>;
};

export function FinanceDashboardTabs({
  activeTab,
  onTabChange,
  accountOptions,
  accountItems,
  categories,
  transactions,
  addAccount,
  addCategory,
  updateCategory,
  deleteCategory,
  updateSubcategory,
  deleteSubcategory,
  getCategoryName,
  getSubcategoryName,
  onEditTransaction,
  onDeleteTransaction,
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
          transactions={transactions}
          categories={categories}
          getCategoryName={getCategoryName}
          getSubcategoryName={getSubcategoryName}
        />
      </TabsContent>

      <TabsContent value="transactions">
        <TransactionTable
          accounts={accountOptions}
          transactions={transactions}
          categories={categories}
          getCategoryName={getCategoryName}
          getSubcategoryName={getSubcategoryName}
          onEdit={onEditTransaction}
          onDelete={onDeleteTransaction}
        />
      </TabsContent>

      <TabsContent value="accounts">
        <AccountManager accounts={accountItems} onAddAccount={addAccount} />
      </TabsContent>

      <TabsContent value="categories">
        <CategoryManager
          categories={categories}
          onAddCategory={addCategory}
          onUpdateCategory={updateCategory}
          onDeleteCategory={deleteCategory}
          onUpdateSubcategory={updateSubcategory}
          onDeleteSubcategory={deleteSubcategory}
        />
      </TabsContent>
    </Tabs>
  );
}
