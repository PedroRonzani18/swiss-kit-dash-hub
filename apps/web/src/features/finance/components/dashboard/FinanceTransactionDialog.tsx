import { TransactionForm } from '@/features/finance/components/management';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { MutationResult, TransactionDraft } from '@/features/finance/types';
import type { AccountOption, Category, Transaction, TransactionType } from '@/types/finance';

type FinanceTransactionDialogProps = {
  open: boolean;
  editingTransaction: Transaction | null;
  accountOptions: AccountOption[];
  categories: Category[];
  onOpenChange: (open: boolean) => void;
  onSave: (drafts: TransactionDraft[]) => Promise<void>;
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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={editingTransaction ? 'max-w-xl' : 'max-w-5xl'}>
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
        />
      </DialogContent>
    </Dialog>
  );
}
