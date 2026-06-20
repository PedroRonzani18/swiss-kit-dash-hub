import { useCallback, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
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
import { getFinanceDashboardStatus } from '@/features/finance/model/dashboardStatus';
import type { Transaction, TransactionType } from '@/types/finance';
import type { MutationResult, TransactionDraft } from '@/features/finance/types';
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
    bulkAddTransactions: finance.transactions.bulkAddTransactions,
    updateTransaction: finance.transactions.updateTransaction,
  });
  const activeTab = parseFinanceTabRoute(tabParam);
  const isNewTransactionAction =
    activeTab === 'transactions' &&
    actionParam === FINANCE_ACTION_ROUTES.newTransaction;
  const hasTabSegment = Boolean(tabParam);
  const hasOpenedNewTransactionFromRoute = useRef(false);
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
    if (isNewTransactionAction && !hasOpenedNewTransactionFromRoute.current) {
      hasOpenedNewTransactionFromRoute.current = true;
      openNewTransactionDialog();
    }
    if (!isNewTransactionAction) {
      hasOpenedNewTransactionFromRoute.current = false;
    }
  }, [isNewTransactionAction, openNewTransactionDialog]);

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

  const handleSaveTransaction = useCallback(
    async (drafts: TransactionDraft[]): Promise<boolean> => {
      const wasSaved = await saveTransaction(drafts);
      if (wasSaved && isNewTransactionAction) {
        navigate(buildFinancePath('transactions'), { replace: true });
      }
      return wasSaved;
    },
    [isNewTransactionAction, navigate, saveTransaction],
  );

  const handleAddCategory = useCallback(
    async (name: string, subName: string, type: TransactionType): Promise<MutationResult> => {
      if (subName.trim()) {
        return finance.categories.addCategory(name, subName, type);
      }
      const result = await finance.categories.createCategory(name, type);
      return result.status as MutationResult;
    },
    [finance.categories],
  );

  const { isInitialLoading, error } = getFinanceDashboardStatus({
    accounts: finance.accounts,
    categories: finance.categories,
    transactions: finance.transactions,
  });
  const hasError = Boolean(error);

  return (
    <>
      {isInitialLoading && !error && <FinanceLoadingState />}
      {!isInitialLoading && hasError && <FinanceErrorState />}
      {!isInitialLoading && !hasError && (
        <>
          <FinanceDashboardContent
            activeTab={activeTab}
            onTabChange={handleTabChange}
            finance={finance}
            onOpenNewTransaction={handleOpenNewTransaction}
            onEditTransaction={handleEditTransaction}
          />

          <FinanceTransactionDialog
            open={isDialogOpen}
            editingTransaction={editingTransaction}
            accountOptions={finance.accounts.accountOptions}
            categories={finance.categories.categories}
            onOpenChange={handleDialogOpenChange}
            onSave={handleSaveTransaction}
            onAddCategory={handleAddCategory}
          />
        </>
      )}
    </>
  );
}
