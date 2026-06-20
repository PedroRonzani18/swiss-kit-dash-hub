import { useCallback, useEffect, useState } from 'react';
import { TransactionForm } from '@/features/finance/components/management';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { MutationResult, TransactionDraft } from '@/features/finance/types';
import type { AccountOption, Category, Transaction, TransactionType } from '@/types/finance';

type FinanceTransactionDialogProps = {
  open: boolean;
  editingTransaction: Transaction | null;
  accountOptions: AccountOption[];
  categories: Category[];
  onOpenChange: (open: boolean) => void;
  onSave: (drafts: TransactionDraft[]) => Promise<boolean>;
  onAddCategory: (name: string, subName: string, type: TransactionType) => Promise<MutationResult>;
};

export function FinanceTransactionDialog({
  open,
  editingTransaction,
  accountOptions,
  categories,
  onOpenChange,
  onSave,
  onAddCategory,
}: FinanceTransactionDialogProps) {
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [isDiscardDialogOpen, setIsDiscardDialogOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      setIsFormDirty(false);
      setIsDiscardDialogOpen(false);
    }
  }, [open]);

  const requestClose = useCallback(() => {
    if (isFormDirty) {
      setIsDiscardDialogOpen(true);
      return;
    }
    onOpenChange(false);
  }, [isFormDirty, onOpenChange]);

  const handleDialogOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      onOpenChange(true);
      return;
    }
    requestClose();
  };

  const handleConfirmDiscard = () => {
    setIsDiscardDialogOpen(false);
    setIsFormDirty(false);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleDialogOpenChange}>
        <DialogContent
          className={editingTransaction ? 'max-w-xl' : 'max-w-5xl'}
          onInteractOutside={(event) => event.preventDefault()}
          onEscapeKeyDown={(event) => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>
              {editingTransaction ? 'Editar Transação' : 'Nova Transação'}
            </DialogTitle>
            <DialogDescription>Preencha os dados da transação.</DialogDescription>
          </DialogHeader>
          <TransactionForm
            accounts={accountOptions}
            categories={categories}
            onSave={onSave}
            onAddCategory={onAddCategory}
            initialData={editingTransaction ?? undefined}
            onDirtyChange={setIsFormDirty}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDiscardDialogOpen} onOpenChange={setIsDiscardDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Descartar alterações?</AlertDialogTitle>
            <AlertDialogDescription>
              Você tem dados preenchidos nesta transação. Se sair agora, essas alterações serão perdidas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continuar editando</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDiscard}>
              Descartar e sair
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
