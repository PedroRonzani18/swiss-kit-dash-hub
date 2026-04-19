import { useCallback, useState } from 'react';
import type { TransactionDraft } from '@/features/finance/types';
import type { Transaction } from '@/types/finance';
import { toast } from 'sonner';

type UseTransactionDialogStateParams = {
  bulkAddTransactions: (transactions: TransactionDraft[]) => Promise<void>;
  updateTransaction: (id: string, transaction: TransactionDraft) => Promise<void>;
};

export function useTransactionDialogState({
  bulkAddTransactions,
  updateTransaction,
}: UseTransactionDialogStateParams) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const openNewTransactionDialog = useCallback(() => {
    setEditingTransaction(null);
    setIsDialogOpen(true);
  }, []);

  const openEditTransactionDialog = useCallback((transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsDialogOpen(true);
  }, []);

  const onDialogOpenChange = useCallback((open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setEditingTransaction(null);
    }
  }, []);

  const saveTransaction = useCallback(
    async (drafts: TransactionDraft[]): Promise<void> => {
      try {
        if (editingTransaction) {
          await updateTransaction(editingTransaction.id, drafts[0]!);
          toast.success('Transação atualizada');
        } else {
          await bulkAddTransactions(drafts);
          toast.success(
            drafts.length === 1
              ? 'Transação adicionada'
              : `${drafts.length} transações adicionadas`,
          );
        }

        setIsDialogOpen(false);
        setEditingTransaction(null);
      } catch (errorSave) {
        const message =
          errorSave instanceof Error
            ? errorSave.message
            : 'Não foi possível salvar a transação';

        toast.error(message);
      }
    },
    [bulkAddTransactions, editingTransaction, updateTransaction],
  );

  return {
    isDialogOpen,
    editingTransaction,
    openNewTransactionDialog,
    openEditTransactionDialog,
    onDialogOpenChange,
    saveTransaction,
  };
}
