import { Transaction, Category } from "@/types/finance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  ChevronDown,
  ChevronRight,
  Filter,
  Calendar,
  TrendingUp,
  TrendingDown,
  Wallet,
  BarChart3,
  ArrowUpDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAdvancedAnalytics } from "@/features/finance/hooks";

interface AdvancedAnalyticsPanelProps {
  transactions: Transaction[];
  categories: Category[];
  getCategoryName: (id: string) => string;
  getSubcategoryName: (catId: string, subId: string) => string;
}

const MONTH_NAMES = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

const fmt = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const pct = (v: number, total: number) =>
  total > 0 ? `${((v / total) * 100).toFixed(1)}%` : "0%";

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
      <Card>
        <CardContent className="pb-4 pt-4">
          <div className="flex flex-wrap items-center gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  Anos ({selectedYears.length})
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-40 p-3" align="start">
                <div className="space-y-2">
                  {availableYears.map(year => (
                    <label
                      key={year}
                      className="flex cursor-pointer items-center gap-2 text-sm"
                    >
                      <Checkbox
                        checked={selectedYears.includes(year)}
                        onCheckedChange={() => toggleYear(year)}
                      />
                      {year}
                    </label>
                  ))}
                  {availableYears.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      Sem anos com transações.
                    </p>
                  )}
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  Meses ({selectedMonths.length})
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-3" align="start">
                <div className="mb-2 flex justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={selectAllMonths}
                  >
                    Todos
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={clearMonths}
                  >
                    Nenhum
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {availableMonths.map(month => (
                    <label
                      key={month}
                      className="flex cursor-pointer items-center gap-1.5 text-xs"
                    >
                      <Checkbox
                        checked={selectedMonths.includes(month)}
                        onCheckedChange={() => toggleMonth(month)}
                      />
                      {MONTH_NAMES[month]}
                    </label>
                  ))}
                  {availableMonths.length === 0 && (
                    <p className="col-span-3 text-xs text-muted-foreground">
                      Sem meses com transações.
                    </p>
                  )}
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Filter className="h-3.5 w-3.5" />
                  Categorias ({selectedCategoryIds.length}/{categories.length})
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-60 p-3" align="start">
                <div className="mb-2 flex justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={selectAllCategories}
                  >
                    Todas
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={clearCategories}
                  >
                    Nenhuma
                  </Button>
                </div>
                <div className="max-h-48 space-y-2 overflow-y-auto">
                  {categories.map(category => (
                    <label
                      key={category.id}
                      className="flex cursor-pointer items-center gap-2 text-sm"
                    >
                      <Checkbox
                        checked={selectedCategoryIds.includes(category.id)}
                        onCheckedChange={() => toggleCategory(category.id)}
                      />
                      <span>{category.name}</span>
                      <Badge variant="outline" className="ml-auto px-1.5 py-0 text-[10px]">
                        {category.type === "income" ? "Receita" : "Despesa"}
                      </Badge>
                    </label>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <div className="ml-auto flex gap-1 rounded-md bg-secondary p-1">
              {(["all", "income", "expense"] as const).map(value => (
                <button
                  key={value}
                  onClick={() => setTypeFilter(value)}
                  className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                    typeFilter === value
                      ? "bg-status-success text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {value === "all"
                    ? "Todos"
                    : value === "income"
                      ? "Receitas"
                      : "Despesas"}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-1.5 text-xs font-normal text-muted-foreground">
              <TrendingUp className="h-3.5 w-3.5 text-status-success" />
              Receita Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-xl font-bold text-status-success">
              {fmt(totalIncome)}
            </p>
            <p className="mt-1 text-[10px] text-muted-foreground">
              Média: {fmt(extraStats.avgIncome)}/mês
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-1.5 text-xs font-normal text-muted-foreground">
              <TrendingDown className="h-3.5 w-3.5 text-destructive" />
              Despesa Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-xl font-bold text-destructive">
              {fmt(totalExpense)}
            </p>
            <p className="mt-1 text-[10px] text-muted-foreground">
              Média: {fmt(extraStats.avgExpense)}/mês
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-1.5 text-xs font-normal text-muted-foreground">
              <Wallet className="h-3.5 w-3.5" />
              Saldo Líquido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p
              className={`font-mono text-xl font-bold ${
                balance >= 0 ? "text-status-success" : "text-destructive"
              }`}
            >
              {fmt(balance)}
            </p>
            <p className="mt-1 text-[10px] text-muted-foreground">
              {extraStats.numMonths} mês(es) selecionado(s)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-1.5 text-xs font-normal text-muted-foreground">
              <BarChart3 className="h-3.5 w-3.5" />
              Taxa de Economia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p
              className={`font-mono text-xl font-bold ${
                savingsRate >= 0 ? "text-status-success" : "text-destructive"
              }`}
            >
              {savingsRate.toFixed(1)}%
            </p>
            <Progress
              value={Math.max(0, savingsRate)}
              className="mt-2 h-1.5 [&>div]:bg-status-success"
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {(typeFilter === "all" || typeFilter === "income") && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-status-success" />
                Receitas por Categoria
              </CardTitle>
            </CardHeader>
            <CardContent>
              {categoryBreakdown.incomeCategories.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  Sem dados de receita no período.
                </p>
              ) : (
                <div className="space-y-1">
                  <div className="grid grid-cols-[1fr_100px_60px_80px] gap-2 border-b border-border px-2 pb-1 text-[10px] font-medium text-muted-foreground">
                    <span>Categoria</span>
                    <span className="text-right">Valor</span>
                    <span className="text-right">%</span>
                    <span></span>
                  </div>
                  {categoryBreakdown.incomeCategories.map(({ cat, total, subs }) => (
                    <div key={cat.id}>
                      <button
                        onClick={() => toggleExpanded(cat.id)}
                        className="grid w-full grid-cols-[1fr_100px_60px_80px] items-center gap-2 rounded px-2 py-1.5 transition-colors hover:bg-secondary/50"
                      >
                        <span className="flex items-center gap-1.5 text-left text-sm font-medium">
                          {expandedCategories.has(cat.id) ? (
                            <ChevronDown className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronRight className="h-3.5 w-3.5" />
                          )}
                          {cat.name}
                        </span>
                        <span className="text-right font-mono text-sm text-status-success">
                          {fmt(total)}
                        </span>
                        <span className="text-right text-xs text-muted-foreground">
                          {pct(total, totalIncome)}
                        </span>
                        <Progress
                          value={(total / totalIncome) * 100}
                          className="h-1.5 [&>div]:bg-status-success"
                        />
                      </button>
                      {expandedCategories.has(cat.id) &&
                        subs.map(sub => (
                          <div
                            key={sub.id}
                            className="grid grid-cols-[1fr_100px_60px_80px] items-center gap-2 px-2 py-1 pl-8"
                          >
                            <span className="text-xs text-muted-foreground">
                              {sub.name}
                            </span>
                            <span className="text-right font-mono text-xs">
                              {fmt(sub.total)}
                            </span>
                            <span className="text-right text-[10px] text-muted-foreground">
                              {pct(sub.total, totalIncome)}
                            </span>
                            <Progress
                              value={(sub.total / totalIncome) * 100}
                              className="h-1 [&>div]:bg-status-success/60"
                            />
                          </div>
                        ))}
                    </div>
                  ))}
                  <div className="grid grid-cols-[1fr_100px_60px_80px] gap-2 border-t border-border px-2 pt-2">
                    <span className="text-sm font-bold">Total Receitas</span>
                    <span className="text-right font-mono text-sm font-bold text-status-success">
                      {fmt(totalIncome)}
                    </span>
                    <span className="text-right text-xs">100%</span>
                    <span></span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {(typeFilter === "all" || typeFilter === "expense") && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <TrendingDown className="h-4 w-4 text-destructive" />
                Despesas por Categoria
              </CardTitle>
            </CardHeader>
            <CardContent>
              {categoryBreakdown.expenseCategories.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  Sem dados de despesa no período.
                </p>
              ) : (
                <div className="space-y-1">
                  <div className="grid grid-cols-[1fr_100px_60px_80px] gap-2 border-b border-border px-2 pb-1 text-[10px] font-medium text-muted-foreground">
                    <span>Categoria</span>
                    <span className="text-right">Valor</span>
                    <span className="text-right">%</span>
                    <span></span>
                  </div>
                  {categoryBreakdown.expenseCategories.map(({ cat, total, subs }) => (
                    <div key={cat.id}>
                      <button
                        onClick={() => toggleExpanded(cat.id)}
                        className="grid w-full grid-cols-[1fr_100px_60px_80px] items-center gap-2 rounded px-2 py-1.5 transition-colors hover:bg-secondary/50"
                      >
                        <span className="flex items-center gap-1.5 text-left text-sm font-medium">
                          {expandedCategories.has(cat.id) ? (
                            <ChevronDown className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronRight className="h-3.5 w-3.5" />
                          )}
                          {cat.name}
                        </span>
                        <span className="text-right font-mono text-sm text-destructive">
                          {fmt(total)}
                        </span>
                        <span className="text-right text-xs text-muted-foreground">
                          {pct(total, totalExpense)}
                        </span>
                        <Progress
                          value={(total / totalExpense) * 100}
                          className="h-1.5 [&>div]:bg-destructive"
                        />
                      </button>
                      {expandedCategories.has(cat.id) &&
                        subs.map(sub => (
                          <div
                            key={sub.id}
                            className="grid grid-cols-[1fr_100px_60px_80px] items-center gap-2 px-2 py-1 pl-8"
                          >
                            <span className="text-xs text-muted-foreground">
                              {sub.name}
                            </span>
                            <span className="text-right font-mono text-xs">
                              {fmt(sub.total)}
                            </span>
                            <span className="text-right text-[10px] text-muted-foreground">
                              {pct(sub.total, totalExpense)}
                            </span>
                            <Progress
                              value={(sub.total / totalExpense) * 100}
                              className="h-1 [&>div]:bg-destructive/60"
                            />
                          </div>
                        ))}
                    </div>
                  ))}
                  <div className="grid grid-cols-[1fr_100px_60px_80px] gap-2 border-t border-border px-2 pt-2">
                    <span className="text-sm font-bold">Total Despesas</span>
                    <span className="text-right font-mono text-sm font-bold text-destructive">
                      {fmt(totalExpense)}
                    </span>
                    <span className="text-right text-xs">100%</span>
                    <span></span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

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
            {monthlyBreakdown.map(month => {
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
