import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { TransactionForm } from "@/components/finance/TransactionForm";
import { TransactionTable } from "@/components/finance/TransactionTable";
import { CategoryManager } from "@/components/finance/CategoryManager";
import { AdvancedAnalyticsPanel } from "@/components/finance/AdvancedAnalyticsPanel";
import { useFinanceStore } from "@/hooks/useFinanceStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Transaction } from "@/data/mockData";
import { toast } from "sonner";

const Index = () => {
  const {
    categories,
    transactions,
    addCategory,
    updateCategory,
    deleteCategory,
    updateSubcategory,
    deleteSubcategory,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getCategoryName,
    getSubcategoryName,
  } = useFinanceStore();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleOpenNew = () => {
    setEditingTransaction(null);
    setDialogOpen(true);
  };

  const handleEdit = (t: Transaction) => {
    setEditingTransaction(t);
    setDialogOpen(true);
  };

  const handleSave = (data: Omit<Transaction, "id">) => {
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, data);
      toast.success("Transação atualizada");
    } else {
      addTransaction(data);
      toast.success("Transação adicionada");
    }
    setDialogOpen(false);
    setEditingTransaction(null);
  };

  const handleDelete = (id: string) => {
    deleteTransaction(id);
  };

  return (
    <AppLayout breadcrumbs={["SwissKit", "Financeiro"]}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold tracking-tight">Dashboard Financeiro</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gerencie suas finanças pessoais com controle total.
            </p>
          </div>
          <Button onClick={handleOpenNew} className="gap-1">
            <Plus className="h-4 w-4" />
            Nova Transação
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList className="bg-secondary">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="transactions">Transações</TabsTrigger>
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
              transactions={transactions}
              categories={categories}
              getCategoryName={getCategoryName}
              getSubcategoryName={getSubcategoryName}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
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

        {/* Transaction Dialog */}
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) setEditingTransaction(null); }}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingTransaction ? "Editar Transação" : "Nova Transação"}</DialogTitle>
              <DialogDescription>Preencha os dados da transação.</DialogDescription>
            </DialogHeader>
            <TransactionForm
              categories={categories}
              onSave={handleSave}
              initialData={editingTransaction ?? undefined}
            />
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default Index;
