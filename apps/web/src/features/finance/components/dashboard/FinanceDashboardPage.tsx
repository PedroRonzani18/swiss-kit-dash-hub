import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import {
  useFinanceDashboardData,
  useTransactionDialogState,
} from '@/features/finance/hooks';
import {
  buildFinancePath,
  FINANCE_ACTION_ROUTES,
  parseFinanceTabRoute,
  type FinanceTabRoute,
} from '@/features/finance/navigation';
import type { Transaction } from '@/types/finance';
import { FinanceErrorState } from '../states/FinanceErrorState';
import { FinanceLoadingState } from '../states/FinanceLoadingState';
import { FinanceDashboardContent } from './FinanceDashboardContent';
import { FinanceTransactionDialog } from './FinanceTransactionDialog';

export function FinanceDashboardPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { tab: tabParam, action: actionParam } = useParams<{
    tab?: string;
    action?: string;
  }>();
  const finance = useFinanceDashboardData();
  const {
    isDialogOpen,
    editingTransaction,
    openNewTransactionDialog,
    openEditTransactionDialog,
    onDialogOpenChange,
    saveTransaction,
  } = useTransactionDialogState({
    addTransaction: finance.transactions.addTransaction,
    updateTransaction: finance.transactions.updateTransaction,
  });
  const activeTab = parseFinanceTabRoute(tabParam);
  const isNewTransactionAction =
    activeTab === 'transactions' &&
    actionParam === FINANCE_ACTION_ROUTES.newTransaction;
  const hasTabSegment = Boolean(tabParam);
  const canonicalPath = buildFinancePath(
    activeTab,
    isNewTransactionAction ? FINANCE_ACTION_ROUTES.newTransaction : undefined,
  );

  useEffect(() => {
    if (hasTabSegment && location.pathname !== canonicalPath) {
      navigate(canonicalPath, { replace: true });
    }
  }, [canonicalPath, hasTabSegment, location.pathname, navigate]);

  useEffect(() => {
    if (isNewTransactionAction && !isDialogOpen) {
      openNewTransactionDialog();
    }
  }, [isDialogOpen, isNewTransactionAction, openNewTransactionDialog]);

  useEffect(() => {
    if (activeTab !== 'transactions' && isDialogOpen) {
      onDialogOpenChange(false);
    }
  }, [activeTab, isDialogOpen, onDialogOpenChange]);

  const handleTabChange = (tab: FinanceTabRoute) => {
    navigate(buildFinancePath(tab));
  };

  const handleOpenNewTransaction = () => {
    navigate(
      buildFinancePath(
        'transactions',
        FINANCE_ACTION_ROUTES.newTransaction,
      ),
    );
  };

  const handleEditTransaction = (transaction: Transaction) => {
    if (activeTab !== 'transactions') {
      navigate(buildFinancePath('transactions'));
    }

    openEditTransactionDialog(transaction);
  };

  const handleDialogOpenChange = (open: boolean) => {
    onDialogOpenChange(open);

    if (!open && isNewTransactionAction) {
      navigate(buildFinancePath('transactions'), { replace: true });
    }
  };

  const hasFetchedAll =
    finance.accounts.hasFetched &&
    finance.categories.hasFetched &&
    finance.transactions.hasFetched;
  const isInitialLoading = !hasFetchedAll;

  const error =
    finance.accounts.error ||
    finance.categories.error ||
    finance.transactions.error;

  return (
    <AppLayout breadcrumbs={['SwissKit', 'Financeiro']}>
      {isInitialLoading && !error && <FinanceLoadingState />}
      {!isInitialLoading && error && <FinanceErrorState />}
      {!isInitialLoading && !error && (
        <>
          <FinanceDashboardContent
            activeTab={activeTab}
            onTabChange={handleTabChange}
            accounts={finance.accounts}
            categories={finance.categories}
            transactions={finance.transactions}
            onOpenNewTransaction={handleOpenNewTransaction}
            onEditTransaction={handleEditTransaction}
            onDeleteTransaction={finance.transactions.deleteTransaction}
          />

          <FinanceTransactionDialog
            open={isDialogOpen}
            editingTransaction={editingTransaction}
            accountOptions={finance.accounts.accountOptions}
            categories={finance.categories.categories}
            onOpenChange={handleDialogOpenChange}
            onSave={saveTransaction}
          />
        </>
      )}
    </AppLayout>
  );
}
