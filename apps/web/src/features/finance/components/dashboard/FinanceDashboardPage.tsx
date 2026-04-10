import { AppLayout } from '@/components/AppLayout';
import {
  useFinanceDashboardData,
  useTransactionDialogState,
} from '@/features/finance/hooks';
import { FinanceErrorState } from '../states/FinanceErrorState';
import { FinanceLoadingState } from '../states/FinanceLoadingState';
import { FinanceDashboardContent } from './FinanceDashboardContent';
import { FinanceTransactionDialog } from './FinanceTransactionDialog';

export function FinanceDashboardPage() {
  const finance = useFinanceDashboardData();
  const transactionDialog = useTransactionDialogState({
    addTransaction: finance.transactions.addTransaction,
    updateTransaction: finance.transactions.updateTransaction,
  });

  const isLoading =
    finance.accounts.isLoading ||
    finance.categories.isLoading ||
    finance.transactions.isLoading;

  const error =
    finance.accounts.error ||
    finance.categories.error ||
    finance.transactions.error;

  return (
    <AppLayout breadcrumbs={['SwissKit', 'Financeiro']}>
      {isLoading && <FinanceLoadingState />}
      {!isLoading && error && <FinanceErrorState />}
      {!isLoading && !error && (
        <>
          <FinanceDashboardContent
            accounts={finance.accounts}
            categories={finance.categories}
            transactions={finance.transactions}
            onOpenNewTransaction={transactionDialog.openNewTransactionDialog}
            onEditTransaction={transactionDialog.openEditTransactionDialog}
            onDeleteTransaction={finance.transactions.deleteTransaction}
          />

          <FinanceTransactionDialog
            open={transactionDialog.isDialogOpen}
            editingTransaction={transactionDialog.editingTransaction}
            accountOptions={finance.accounts.accountOptions}
            categories={finance.categories.categories}
            onOpenChange={transactionDialog.onDialogOpenChange}
            onSave={transactionDialog.saveTransaction}
          />
        </>
      )}
    </AppLayout>
  );
}
