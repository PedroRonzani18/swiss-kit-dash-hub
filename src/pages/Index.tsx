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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

const Index = () => {
  const {
    categories,
    transactions,
    addCategory,
    addTransaction,
    getCategoryName,
    getSubcategoryName,
  } = useFinanceStore();

  const [sheetOpen, setSheetOpen] = useState(false);

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
          <Button onClick={() => setSheetOpen(true)} className="gap-1">
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
              getCategoryName={getCategoryName}
              getSubcategoryName={getSubcategoryName}
            />
          </TabsContent>

          <TabsContent value="categories">
            <CategoryManager
              categories={categories}
              onAddCategory={addCategory}
            />
          </TabsContent>
        </Tabs>

        {/* Transaction Sheet */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Nova Transação</SheetTitle>
              <SheetDescription>Preencha os dados da transação.</SheetDescription>
            </SheetHeader>
            <div className="mt-6">
              <TransactionForm
                categories={categories}
                onAdd={(t) => {
                  addTransaction(t);
                  setSheetOpen(false);
                }}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </AppLayout>
  );
};

export default Index;
