import { ArrowUpDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAdvancedAnalytics } from "@/features/finance/hooks";
import { MONTH_NAMES } from "@/features/finance/model/analytics";
import type { Category, Transaction } from "@/types/finance";
import {
  AnalyticsCategoryBreakdown,
  AnalyticsFilters,
  AnalyticsSummaryCards,
} from "./analytics";

interface AdvancedAnalyticsPanelProps {
  transactions: Transaction[];
  categories: Category[];
  getCategoryName: (id: string) => string;
  getSubcategoryName: (catId: string, subId: string) => string;
}

const fmt = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const pct = (value: number, total: number) =>
  total > 0 ? `${((value / total) * 100).toFixed(1)}%` : "0%";

export function AdvancedAnalyticsPanel({
  transactions,
  categories,
  getCategoryName,
  getSubcategoryName,
}: AdvancedAnalyticsPanelProps) {
  const {
    selectedYears,
    selectedMonths,
    selectedCategoryIds,
    expandedCategories,
    typeFilter,
    setTypeFilter,
    availableYears,
    availableMonths,
    categoryBreakdown,
    monthlyBreakdown,
    totalIncome,
    totalExpense,
    balance,
    savingsRate,
    extraStats,
    maxMonthlyValue,
    toggleYear,
    toggleMonth,
    toggleCategory,
    toggleExpanded,
    selectAllMonths,
    clearMonths,
    selectAllCategories,
    clearCategories,
  } = useAdvancedAnalytics(transactions, categories, getSubcategoryName);

  return (
    <div className="space-y-6">
      <AnalyticsFilters
        selectedYears={selectedYears}
        selectedMonths={selectedMonths}
        selectedCategoryIds={selectedCategoryIds}
        typeFilter={typeFilter}
        availableYears={availableYears}
        availableMonths={availableMonths}
        categories={categories}
        setTypeFilter={setTypeFilter}
        toggleYear={toggleYear}
        toggleMonth={toggleMonth}
        toggleCategory={toggleCategory}
        selectAllMonths={selectAllMonths}
        clearMonths={clearMonths}
        selectAllCategories={selectAllCategories}
        clearCategories={clearCategories}
        monthNames={MONTH_NAMES}
      />

      <AnalyticsSummaryCards
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        balance={balance}
        savingsRate={savingsRate}
        avgIncome={extraStats.avgIncome}
        avgExpense={extraStats.avgExpense}
        numMonths={extraStats.numMonths}
        formatCurrency={fmt}
      />

      <AnalyticsCategoryBreakdown
        typeFilter={typeFilter}
        incomeCategories={categoryBreakdown.incomeCategories}
        expenseCategories={categoryBreakdown.expenseCategories}
        expandedCategories={expandedCategories}
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        toggleExpanded={toggleExpanded}
        formatCurrency={fmt}
        formatPercent={pct}
      />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <ArrowUpDown className="h-4 w-4" />
            Breakdown Mensal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <div className="grid grid-cols-[120px_1fr_1fr_1fr] gap-3 border-b border-border px-2 pb-1 text-[10px] font-medium text-muted-foreground">
              <span>Período</span>
              <span className="text-right">Receita</span>
              <span className="text-right">Despesa</span>
              <span className="text-right">Saldo</span>
            </div>
            {monthlyBreakdown.map((month) => {
              const monthBalance = month.income - month.expense;
              return (
                <div
                  key={month.label}
                  className="grid grid-cols-[120px_1fr_1fr_1fr] items-center gap-3 rounded px-2 py-2 transition-colors hover:bg-secondary/30"
                >
                  <span className="text-sm font-medium">{month.label}</span>
                  <div className="space-y-1">
                    <span className="block text-right font-mono text-xs text-status-success">
                      {fmt(month.income)}
                    </span>
                    <Progress
                      value={(month.income / maxMonthlyValue) * 100}
                      className="h-1 [&>div]:bg-status-success"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="block text-right font-mono text-xs text-destructive">
                      {fmt(month.expense)}
                    </span>
                    <Progress
                      value={(month.expense / maxMonthlyValue) * 100}
                      className="h-1 [&>div]:bg-destructive"
                    />
                  </div>
                  <div>
                    <span
                      className={`block text-right font-mono text-xs ${
                        monthBalance >= 0 ? "text-status-success" : "text-destructive"
                      }`}
                    >
                      {fmt(monthBalance)}
                    </span>
                  </div>
                </div>
              );
            })}
            <div className="grid grid-cols-[120px_1fr_1fr_1fr] gap-3 border-t border-border px-2 pt-2">
              <span className="text-sm font-bold">Total</span>
              <span className="text-right font-mono text-sm font-bold text-status-success">
                {fmt(totalIncome)}
              </span>
              <span className="text-right font-mono text-sm font-bold text-destructive">
                {fmt(totalExpense)}
              </span>
              <span
                className={`text-right font-mono text-sm font-bold ${
                  balance >= 0 ? "text-status-success" : "text-destructive"
                }`}
              >
                {fmt(balance)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Indicadores Extras</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Maior Gasto Individual
              </p>
              {extraStats.biggestExpense ? (
                <>
                  <p className="text-sm font-medium">
                    {extraStats.biggestExpense.description}
                  </p>
                  <p className="font-mono text-lg font-bold text-destructive">
                    {fmt(extraStats.biggestExpense.amount)}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {getCategoryName(extraStats.biggestExpense.categoryId)} →{" "}
                    {getSubcategoryName(
                      extraStats.biggestExpense.categoryId,
                      extraStats.biggestExpense.subcategoryId,
                    )}
                  </p>
                </>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Sem despesas no período.
                </p>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Média Mensal de Receita
              </p>
              <p className="font-mono text-lg font-bold text-status-success">
                {fmt(extraStats.avgIncome)}
              </p>
              <p className="text-[10px] text-muted-foreground">
                Baseado em {extraStats.numMonths} mês(es)
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Média Mensal de Despesa
              </p>
              <p className="font-mono text-lg font-bold text-destructive">
                {fmt(extraStats.avgExpense)}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {totalIncome > 0
                  ? `${((totalExpense / totalIncome) * 100).toFixed(1)}% da receita`
                  : "—"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
