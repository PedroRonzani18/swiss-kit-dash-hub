import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AccountManager } from '@/components/finance/AccountManager';
import { AdvancedAnalyticsPanel } from '@/components/finance/AdvancedAnalyticsPanel';
import { CategoryManager } from '@/components/finance/CategoryManager';
import { TransactionForm } from '@/components/finance/TransactionForm';
import { TransactionTable } from '@/components/finance/TransactionTable';
import type { FinanceDashboardData } from '@/features/finance/hooks';
import type { Transaction } from '@/types/finance';
import { toast } from 'sonner';

type FinanceDashboardContentProps = {
  finance: FinanceDashboardData;
};

export function FinanceDashboardContent({ finance }: FinanceDashboardContentProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleOpenNew = () => {
    setEditingTransaction(null);
    setDialogOpen(true);
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setDialogOpen(true);
  };

  const handleSave = async (data: Parameters<typeof finance.addTransaction>[0]) => {
    try {
      if (editingTransaction) {
        await finance.updateTransaction(editingTransaction.id, data);
        toast.success('Transação atualizada');
      } else {
        await finance.addTransaction(data);
        toast.success('Transação adicionada');
      }
      setDialogOpen(false);
      setEditingTransaction(null);
    } catch (errorSave) {
      const message =
        errorSave instanceof Error
          ? errorSave.message
          : 'Não foi possível salvar a transação';
      toast.error(message);
    }
  };

  const handleDelete = async (id: string) => {
    await finance.deleteTransaction(id);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold tracking-tight">
            Dashboard Financeiro
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie suas finanças pessoais com controle total.
          </p>
        </div>
        <Button onClick={handleOpenNew} className="gap-1">
          <Plus className="h-4 w-4" />
          Nova Transação
        </Button>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList className="bg-secondary">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="transactions">Transações</TabsTrigger>
          <TabsTrigger value="accounts">Contas</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <AdvancedAnalyticsPanel
            transactions={finance.transactions}
            categories={finance.categories}
            getCategoryName={finance.getCategoryName}
            getSubcategoryName={finance.getSubcategoryName}
          />
        </TabsContent>

        <TabsContent value="transactions">
          <TransactionTable
            accounts={finance.accounts}
            transactions={finance.transactions}
            categories={finance.categories}
            getCategoryName={finance.getCategoryName}
            getSubcategoryName={finance.getSubcategoryName}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>

        <TabsContent value="accounts">
          <AccountManager
            accounts={finance.accountItems}
            onAddAccount={finance.addAccount}
          />
        </TabsContent>

        <TabsContent value="categories">
          <CategoryManager
            categories={finance.categories}
            onAddCategory={finance.addCategory}
            onUpdateCategory={finance.updateCategory}
            onDeleteCategory={finance.deleteCategory}
            onUpdateSubcategory={finance.updateSubcategory}
            onDeleteSubcategory={finance.deleteSubcategory}
          />
        </TabsContent>
      </Tabs>

      <Dialog
        open={dialogOpen}
        onOpenChange={open => {
          setDialogOpen(open);
          if (!open) {
            setEditingTransaction(null);
          }
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingTransaction ? 'Editar Transação' : 'Nova Transação'}
            </DialogTitle>
            <DialogDescription>Preencha os dados da transação.</DialogDescription>
          </DialogHeader>
          <TransactionForm
            accounts={finance.accounts}
            categories={finance.categories}
            onSave={handleSave}
            initialData={editingTransaction ?? undefined}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
