import { useEffect, useMemo, useRef, useState } from "react";
import { Transaction, Category } from "@/types/finance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown, ChevronRight, Filter, Calendar, TrendingUp, TrendingDown, Wallet, BarChart3, ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AdvancedAnalyticsPanelProps {
  transactions: Transaction[];
  categories: Category[];
  getCategoryName: (id: string) => string;
  getSubcategoryName: (catId: string, subId: string) => string;
}

const MONTH_NAMES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

const fmt = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const pct = (v: number, total: number) =>
  total > 0 ? ((v / total) * 100).toFixed(1) + "%" : "0%";

export function AdvancedAnalyticsPanel({
  transactions,
  categories,
  getCategoryName,
  getSubcategoryName,
}: AdvancedAnalyticsPanelProps) {
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [selectedMonths, setSelectedMonths] = useState<number[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense">("all");
  const hasInitializedYears = useRef(false);
  const hasInitializedMonths = useRef(false);
  const hasInitializedCategories = useRef(false);

  const availableYears = useMemo(() => {
    return Array.from(
      new Set(
        transactions.map((transaction) => {
          const date = new Date(transaction.date);
          return date.getFullYear();
        }),
      ),
    ).sort((a, b) => a - b);
  }, [transactions]);

  const availableMonths = useMemo(() => {
    if (transactions.length === 0) {
      return [];
    }

    const yearScope = selectedYears.length > 0 ? selectedYears : availableYears;
    const yearScopeSet = new Set(yearScope);

    return Array.from(
      new Set(
        transactions
          .filter((transaction) => {
            const date = new Date(transaction.date);
            return yearScopeSet.has(date.getFullYear());
          })
          .map((transaction) => {
            const date = new Date(transaction.date);
            return date.getMonth();
          }),
      ),
    ).sort((a, b) => a - b);
  }, [transactions, selectedYears, availableYears]);

  useEffect(() => {
    setSelectedYears((previousYears) => {
      const validYears = previousYears.filter((year) => availableYears.includes(year));

      if (!hasInitializedYears.current && availableYears.length > 0) {
        hasInitializedYears.current = true;
        return [...availableYears];
      }

      return validYears;
    });
  }, [availableYears]);

  useEffect(() => {
    setSelectedMonths((previousMonths) => {
      const validMonths = previousMonths.filter((month) =>
        availableMonths.includes(month),
      );

      if (!hasInitializedMonths.current && availableMonths.length > 0) {
        hasInitializedMonths.current = true;
        return [...availableMonths];
      }

      return validMonths;
    });
  }, [availableMonths]);

  useEffect(() => {
    const categoryIds = categories.map((category) => category.id);

    setSelectedCategoryIds((previousCategoryIds) => {
      const validCategoryIds = previousCategoryIds.filter((id) =>
        categoryIds.includes(id),
      );

      if (!hasInitializedCategories.current && categoryIds.length > 0) {
        hasInitializedCategories.current = true;
        return [...categoryIds];
      }

      return validCategoryIds;
    });
  }, [categories]);

  // Toggle helpers
  const toggleYear = (y: number) =>
    setSelectedYears((prev) => prev.includes(y) ? prev.filter((v) => v !== y) : [...prev, y]);
  const toggleMonth = (m: number) =>
    setSelectedMonths((prev) => prev.includes(m) ? prev.filter((v) => v !== m) : [...prev, m]);
  const toggleCategory = (id: string) =>
    setSelectedCategoryIds((prev) => prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]);
  const toggleExpanded = (id: string) =>
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

  // Filtered transactions
  const filtered = useMemo(
    () =>
      transactions.filter((t) => {
        const d = new Date(t.date);
        return (
          selectedYears.includes(d.getFullYear()) &&
          selectedMonths.includes(d.getMonth()) &&
          selectedCategoryIds.includes(t.categoryId)
        );
      }),
    [transactions, selectedYears, selectedMonths, selectedCategoryIds]
  );

  // Totals
  const totalIncome = useMemo(() => filtered.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0), [filtered]);
  const totalExpense = useMemo(() => filtered.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0), [filtered]);
  const balance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;

  // Category breakdown
  const categoryBreakdown = useMemo(() => {
    const incomeCategories: { cat: Category; total: number; subs: { id: string; name: string; total: number }[] }[] = [];
    const expenseCategories: { cat: Category; total: number; subs: { id: string; name: string; total: number }[] }[] = [];

    categories
      .filter((c) => selectedCategoryIds.includes(c.id))
      .forEach((cat) => {
        const catTx = filtered.filter((t) => t.categoryId === cat.id);
        if (catTx.length === 0) return;
        const total = catTx.reduce((s, t) => s + t.amount, 0);
        const subMap = new Map<string, number>();
        catTx.forEach((t) => subMap.set(t.subcategoryId, (subMap.get(t.subcategoryId) || 0) + t.amount));
        const subs = Array.from(subMap.entries())
          .map(([subId, subTotal]) => ({
            id: subId,
            name: getSubcategoryName(cat.id, subId),
            total: subTotal,
          }))
          .sort((a, b) => b.total - a.total);

        const entry = { cat, total, subs };
        if (cat.type === "income") incomeCategories.push(entry);
        else expenseCategories.push(entry);
      });

    incomeCategories.sort((a, b) => b.total - a.total);
    expenseCategories.sort((a, b) => b.total - a.total);
    return { incomeCategories, expenseCategories };
  }, [filtered, categories, selectedCategoryIds, getSubcategoryName]);

  // Monthly breakdown
  const monthlyBreakdown = useMemo(() => {
    const map = new Map<string, { label: string; income: number; expense: number; sortKey: number }>();
    filtered.forEach((t) => {
      const d = new Date(t.date);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const label = `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
      const sortKey = d.getFullYear() * 100 + d.getMonth();
      if (!map.has(key)) map.set(key, { label, income: 0, expense: 0, sortKey });
      const entry = map.get(key)!;
      if (t.type === "income") entry.income += t.amount;
      else entry.expense += t.amount;
    });
    return Array.from(map.values()).sort((a, b) => a.sortKey - b.sortKey);
  }, [filtered]);

  // Extra stats
  const extraStats = useMemo(() => {
    const numMonths = monthlyBreakdown.length || 1;
    const avgExpense = totalExpense / numMonths;
    const avgIncome = totalIncome / numMonths;
    const biggestExpense = filtered
      .filter((t) => t.type === "expense")
      .sort((a, b) => b.amount - a.amount)[0];
    return { avgExpense, avgIncome, biggestExpense, numMonths };
  }, [filtered, totalExpense, totalIncome, monthlyBreakdown]);

  const maxMonthlyValue = Math.max(...monthlyBreakdown.map((m) => Math.max(m.income, m.expense)), 1);

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Year filter */}
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
                  {availableYears.map((y) => (
                    <label key={y} className="flex items-center gap-2 text-sm cursor-pointer">
                      <Checkbox checked={selectedYears.includes(y)} onCheckedChange={() => toggleYear(y)} />
                      {y}
                    </label>
                  ))}
                  {availableYears.length === 0 && (
                    <p className="text-xs text-muted-foreground">Sem anos com transações.</p>
                  )}
                </div>
              </PopoverContent>
            </Popover>

            {/* Month filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  Meses ({selectedMonths.length})
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-3" align="start">
                <div className="flex justify-between mb-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-6 px-2"
                    onClick={() => setSelectedMonths([...availableMonths])}
                  >
                    Todos
                  </Button>
                  <Button variant="ghost" size="sm" className="text-xs h-6 px-2" onClick={() => setSelectedMonths([])}>Nenhum</Button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {availableMonths.map((month) => (
                    <label key={month} className="flex items-center gap-1.5 text-xs cursor-pointer">
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

            {/* Category filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Filter className="h-3.5 w-3.5" />
                  Categorias ({selectedCategoryIds.length}/{categories.length})
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-60 p-3" align="start">
                <div className="flex justify-between mb-2">
                  <Button variant="ghost" size="sm" className="text-xs h-6 px-2" onClick={() => setSelectedCategoryIds(categories.map((c) => c.id))}>Todas</Button>
                  <Button variant="ghost" size="sm" className="text-xs h-6 px-2" onClick={() => setSelectedCategoryIds([])}>Nenhuma</Button>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {categories.map((c) => (
                    <label key={c.id} className="flex items-center gap-2 text-sm cursor-pointer">
                      <Checkbox checked={selectedCategoryIds.includes(c.id)} onCheckedChange={() => toggleCategory(c.id)} />
                      <span>{c.name}</span>
                      <Badge variant="outline" className="ml-auto text-[10px] px-1.5 py-0">
                        {c.type === "income" ? "Receita" : "Despesa"}
                      </Badge>
                    </label>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* Type filter */}
            <div className="flex gap-1 bg-secondary rounded-md p-1 ml-auto">
              {(["all", "income", "expense"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-2.5 py-1 text-xs rounded transition-colors font-medium ${
                    typeFilter === t ? "bg-status-success text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t === "all" ? "Todos" : t === "income" ? "Receitas" : "Despesas"}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground font-normal flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-status-success" /> Receita Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold font-mono text-status-success">{fmt(totalIncome)}</p>
            <p className="text-[10px] text-muted-foreground mt-1">Média: {fmt(extraStats.avgIncome)}/mês</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground font-normal flex items-center gap-1.5">
              <TrendingDown className="h-3.5 w-3.5 text-destructive" /> Despesa Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold font-mono text-destructive">{fmt(totalExpense)}</p>
            <p className="text-[10px] text-muted-foreground mt-1">Média: {fmt(extraStats.avgExpense)}/mês</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground font-normal flex items-center gap-1.5">
              <Wallet className="h-3.5 w-3.5" /> Saldo Líquido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-xl font-bold font-mono ${balance >= 0 ? "text-status-success" : "text-destructive"}`}>{fmt(balance)}</p>
            <p className="text-[10px] text-muted-foreground mt-1">{extraStats.numMonths} mês(es) selecionado(s)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground font-normal flex items-center gap-1.5">
              <BarChart3 className="h-3.5 w-3.5" /> Taxa de Economia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-xl font-bold font-mono ${savingsRate >= 0 ? "text-status-success" : "text-destructive"}`}>{savingsRate.toFixed(1)}%</p>
            <Progress value={Math.max(0, savingsRate)} className="mt-2 h-1.5 [&>div]:bg-status-success" />
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income Section */}
        {(typeFilter === "all" || typeFilter === "income") && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-status-success" />
                Receitas por Categoria
              </CardTitle>
            </CardHeader>
            <CardContent>
              {categoryBreakdown.incomeCategories.length === 0 ? (
                <p className="text-xs text-muted-foreground">Sem dados de receita no período.</p>
              ) : (
                <div className="space-y-1">
                  {/* Header */}
                  <div className="grid grid-cols-[1fr_100px_60px_80px] gap-2 text-[10px] text-muted-foreground font-medium px-2 pb-1 border-b border-border">
                    <span>Categoria</span>
                    <span className="text-right">Valor</span>
                    <span className="text-right">%</span>
                    <span></span>
                  </div>
                  {categoryBreakdown.incomeCategories.map(({ cat, total, subs }) => (
                    <div key={cat.id}>
                      <button
                        onClick={() => toggleExpanded(cat.id)}
                        className="w-full grid grid-cols-[1fr_100px_60px_80px] gap-2 items-center px-2 py-1.5 rounded hover:bg-secondary/50 transition-colors"
                      >
                        <span className="flex items-center gap-1.5 text-sm font-medium text-left">
                          {expandedCategories.has(cat.id) ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                          {cat.name}
                        </span>
                        <span className="text-sm font-mono text-right text-status-success">{fmt(total)}</span>
                        <span className="text-xs text-right text-muted-foreground">{pct(total, totalIncome)}</span>
                        <Progress value={(total / totalIncome) * 100} className="h-1.5 [&>div]:bg-status-success" />
                      </button>
                      {expandedCategories.has(cat.id) && subs.map((sub) => (
                        <div key={sub.id} className="grid grid-cols-[1fr_100px_60px_80px] gap-2 items-center px-2 py-1 pl-8">
                          <span className="text-xs text-muted-foreground">{sub.name}</span>
                          <span className="text-xs font-mono text-right">{fmt(sub.total)}</span>
                          <span className="text-[10px] text-right text-muted-foreground">{pct(sub.total, totalIncome)}</span>
                          <Progress value={(sub.total / totalIncome) * 100} className="h-1 [&>div]:bg-status-success/60" />
                        </div>
                      ))}
                    </div>
                  ))}
                  {/* Total */}
                  <div className="grid grid-cols-[1fr_100px_60px_80px] gap-2 px-2 pt-2 border-t border-border">
                    <span className="text-sm font-bold">Total Receitas</span>
                    <span className="text-sm font-mono font-bold text-right text-status-success">{fmt(totalIncome)}</span>
                    <span className="text-xs text-right">100%</span>
                    <span></span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Expense Section */}
        {(typeFilter === "all" || typeFilter === "expense") && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-destructive" />
                Despesas por Categoria
              </CardTitle>
            </CardHeader>
            <CardContent>
              {categoryBreakdown.expenseCategories.length === 0 ? (
                <p className="text-xs text-muted-foreground">Sem dados de despesa no período.</p>
              ) : (
                <div className="space-y-1">
                  <div className="grid grid-cols-[1fr_100px_60px_80px] gap-2 text-[10px] text-muted-foreground font-medium px-2 pb-1 border-b border-border">
                    <span>Categoria</span>
                    <span className="text-right">Valor</span>
                    <span className="text-right">%</span>
                    <span></span>
                  </div>
                  {categoryBreakdown.expenseCategories.map(({ cat, total, subs }) => (
                    <div key={cat.id}>
                      <button
                        onClick={() => toggleExpanded(cat.id)}
                        className="w-full grid grid-cols-[1fr_100px_60px_80px] gap-2 items-center px-2 py-1.5 rounded hover:bg-secondary/50 transition-colors"
                      >
                        <span className="flex items-center gap-1.5 text-sm font-medium text-left">
                          {expandedCategories.has(cat.id) ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                          {cat.name}
                        </span>
                        <span className="text-sm font-mono text-right text-destructive">{fmt(total)}</span>
                        <span className="text-xs text-right text-muted-foreground">{pct(total, totalExpense)}</span>
                        <Progress value={(total / totalExpense) * 100} className="h-1.5 [&>div]:bg-destructive" />
                      </button>
                      {expandedCategories.has(cat.id) && subs.map((sub) => (
                        <div key={sub.id} className="grid grid-cols-[1fr_100px_60px_80px] gap-2 items-center px-2 py-1 pl-8">
                          <span className="text-xs text-muted-foreground">{sub.name}</span>
                          <span className="text-xs font-mono text-right">{fmt(sub.total)}</span>
                          <span className="text-[10px] text-right text-muted-foreground">{pct(sub.total, totalExpense)}</span>
                          <Progress value={(sub.total / totalExpense) * 100} className="h-1 [&>div]:bg-destructive/60" />
                        </div>
                      ))}
                    </div>
                  ))}
                  <div className="grid grid-cols-[1fr_100px_60px_80px] gap-2 px-2 pt-2 border-t border-border">
                    <span className="text-sm font-bold">Total Despesas</span>
                    <span className="text-sm font-mono font-bold text-right text-destructive">{fmt(totalExpense)}</span>
                    <span className="text-xs text-right">100%</span>
                    <span></span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Monthly Breakdown */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4" />
            Breakdown Mensal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <div className="grid grid-cols-[120px_1fr_1fr_1fr] gap-3 text-[10px] text-muted-foreground font-medium px-2 pb-1 border-b border-border">
              <span>Período</span>
              <span className="text-right">Receita</span>
              <span className="text-right">Despesa</span>
              <span className="text-right">Saldo</span>
            </div>
            {monthlyBreakdown.map((m) => {
              const monthBalance = m.income - m.expense;
              return (
                <div key={m.label} className="grid grid-cols-[120px_1fr_1fr_1fr] gap-3 items-center px-2 py-2 rounded hover:bg-secondary/30 transition-colors">
                  <span className="text-sm font-medium">{m.label}</span>
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-status-success block text-right">{fmt(m.income)}</span>
                    <Progress value={(m.income / maxMonthlyValue) * 100} className="h-1 [&>div]:bg-status-success" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-destructive block text-right">{fmt(m.expense)}</span>
                    <Progress value={(m.expense / maxMonthlyValue) * 100} className="h-1 [&>div]:bg-destructive" />
                  </div>
                  <div>
                    <span className={`text-xs font-mono block text-right ${monthBalance >= 0 ? "text-status-success" : "text-destructive"}`}>
                      {fmt(monthBalance)}
                    </span>
                  </div>
                </div>
              );
            })}
            {/* Totals row */}
            <div className="grid grid-cols-[120px_1fr_1fr_1fr] gap-3 px-2 pt-2 border-t border-border">
              <span className="text-sm font-bold">Total</span>
              <span className="text-sm font-mono font-bold text-right text-status-success">{fmt(totalIncome)}</span>
              <span className="text-sm font-mono font-bold text-right text-destructive">{fmt(totalExpense)}</span>
              <span className={`text-sm font-mono font-bold text-right ${balance >= 0 ? "text-status-success" : "text-destructive"}`}>{fmt(balance)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Extra Stats */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Indicadores Extras</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Maior Gasto Individual</p>
              {extraStats.biggestExpense ? (
                <>
                  <p className="text-sm font-medium">{extraStats.biggestExpense.description}</p>
                  <p className="text-lg font-mono font-bold text-destructive">{fmt(extraStats.biggestExpense.amount)}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {getCategoryName(extraStats.biggestExpense.categoryId)} → {getSubcategoryName(extraStats.biggestExpense.categoryId, extraStats.biggestExpense.subcategoryId)}
                  </p>
                </>
              ) : (
                <p className="text-xs text-muted-foreground">Sem despesas no período.</p>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Média Mensal de Receita</p>
              <p className="text-lg font-mono font-bold text-status-success">{fmt(extraStats.avgIncome)}</p>
              <p className="text-[10px] text-muted-foreground">Baseado em {extraStats.numMonths} mês(es)</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Média Mensal de Despesa</p>
              <p className="text-lg font-mono font-bold text-destructive">{fmt(extraStats.avgExpense)}</p>
              <p className="text-[10px] text-muted-foreground">
                {totalIncome > 0 ? `${((totalExpense / totalIncome) * 100).toFixed(1)}% da receita` : "—"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
