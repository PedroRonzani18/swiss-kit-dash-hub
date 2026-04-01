import { useState, useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { TransactionForm } from "@/components/finance/TransactionForm";
import { TransactionTable } from "@/components/finance/TransactionTable";
import { CategoryManager } from "@/components/finance/CategoryManager";
import { AnalyticsPanel } from "@/components/finance/AnalyticsPanel";
import { AdvancedAnalyticsPanel } from "@/components/finance/AdvancedAnalyticsPanel";
import { useFinanceStore } from "@/hooks/useFinanceStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const months = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

const Index = () => {
  const {
    categories,
    transactions,
    addCategory,
    addTransaction,
    getFilteredTransactions,
    getCategoryName,
    getSubcategoryName,
  } = useFinanceStore();

  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(2); // March = index 2

  const filteredTx = useMemo(
    () => getFilteredTransactions(year, month),
    [year, month, getFilteredTransactions]
  );

  return (
    <AppLayout breadcrumbs={["SwissKit", "Financeiro"]}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page title */}
        <div>
          <h1 className="text-2xl font-display font-bold tracking-tight">Dashboard Financeiro</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie suas finanças pessoais com controle total.
          </p>
        </div>

        {/* Transaction Form */}
        <TransactionForm categories={categories} onAdd={addTransaction} />

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2026">2026</SelectItem>
              <SelectItem value="2027">2027</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-1 bg-secondary rounded-md p-1">
            {months.map((m, i) => (
              <button
                key={m}
                onClick={() => setMonth(i)}
                className={`px-2.5 py-1 text-xs rounded transition-colors font-medium ${
                  month === i
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="analytics" className="space-y-4">
          <TabsList className="bg-secondary">
            <TabsTrigger value="analytics">Relatórios</TabsTrigger>
            <TabsTrigger value="transactions">Transações</TabsTrigger>
            <TabsTrigger value="categories">Categorias</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics">
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="bg-secondary">
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="advanced">Análise Avançada</TabsTrigger>
              </TabsList>
              <TabsContent value="overview">
                <AnalyticsPanel
                  transactions={filteredTx}
                  categories={categories}
                  getCategoryName={getCategoryName}
                  getSubcategoryName={getSubcategoryName}
                />
              </TabsContent>
              <TabsContent value="advanced">
                <AdvancedAnalyticsPanel
                  transactions={transactions}
                  categories={categories}
                  getCategoryName={getCategoryName}
                  getSubcategoryName={getSubcategoryName}
                />
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="transactions">
            <TransactionTable
              transactions={filteredTx}
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
      </div>
    </AppLayout>
  );
};

export default Index;
