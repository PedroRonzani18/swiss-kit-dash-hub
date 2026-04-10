import { useMemo } from "react";
import { Transaction, Category } from "@/types/finance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";

interface AnalyticsPanelProps {
  transactions: Transaction[];
  categories: Category[];
  getCategoryName: (id: string) => string;
  getSubcategoryName: (catId: string, subId: string) => string;
}

const PIE_COLORS = [
  "hsl(142, 60%, 50%)",
  "hsl(200, 70%, 55%)",
  "hsl(35, 90%, 55%)",
  "hsl(280, 60%, 60%)",
  "hsl(0, 72%, 55%)",
  "hsl(170, 60%, 45%)",
];

export function AnalyticsPanel({
  transactions,
  categories: _categories,
  getCategoryName,
  getSubcategoryName,
}: AnalyticsPanelProps) {
  const totalIncome = useMemo(
    () => transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0),
    [transactions]
  );
  const totalExpense = useMemo(
    () => transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0),
    [transactions]
  );
  const balance = totalIncome - totalExpense;

  const fmt = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  // Donut data: expenses by category
  const donutData = useMemo(() => {
    const map = new Map<string, number>();
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        const name = getCategoryName(t.categoryId);
        map.set(name, (map.get(name) || 0) + t.amount);
      });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [transactions, getCategoryName]);

  // Bar data
  const barData = [
    { name: "Receitas", value: totalIncome },
    { name: "Despesas", value: totalExpense },
  ];

  // Top 5 subcategories
  const top5 = useMemo(() => {
    const map = new Map<string, { name: string; amount: number }>();
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        const key = t.subcategoryId;
        const name = getSubcategoryName(t.categoryId, t.subcategoryId);
        const prev = map.get(key);
        map.set(key, { name, amount: (prev?.amount || 0) + t.amount });
      });
    return Array.from(map.values())
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [transactions, getSubcategoryName]);

  const maxExpenseProgress = totalIncome > 0 ? Math.min((totalExpense / totalIncome) * 100, 100) : 0;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="animate-fade-in">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground font-normal flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-primary" />
              Receita Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold font-mono-code text-primary">{fmt(totalIncome)}</p>
            <Progress value={100} className="mt-2 h-1.5 [&>div]:bg-primary" />
          </CardContent>
        </Card>
        <Card className="animate-fade-in" style={{ animationDelay: "0.05s" }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground font-normal flex items-center gap-1.5">
              <TrendingDown className="h-3.5 w-3.5 text-destructive" />
              Despesa Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold font-mono-code text-destructive">{fmt(totalExpense)}</p>
            <Progress value={maxExpenseProgress} className="mt-2 h-1.5 [&>div]:bg-destructive" />
          </CardContent>
        </Card>
        <Card className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground font-normal flex items-center gap-1.5">
              <Wallet className="h-3.5 w-3.5" />
              Saldo Líquido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold font-mono-code ${balance >= 0 ? "text-primary" : "text-destructive"}`}>
              {fmt(balance)}
            </p>
            <Progress
              value={totalIncome > 0 ? (balance / totalIncome) * 100 : 0}
              className={`mt-2 h-1.5 ${balance >= 0 ? "[&>div]:bg-primary" : "[&>div]:bg-destructive"}`}
            />
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donut */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Despesas por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {donutData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => fmt(value)}
                  contentStyle={{
                    backgroundColor: "hsl(225, 14%, 11%)",
                    border: "1px solid hsl(225, 12%, 16%)",
                    borderRadius: "8px",
                    color: "hsl(210, 20%, 92%)",
                    fontSize: "12px",
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: "12px", color: "hsl(220,10%,55%)" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Receitas vs Despesas</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(225,12%,16%)" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "hsl(220,10%,55%)" }} />
                <YAxis tick={{ fontSize: 12, fill: "hsl(220,10%,55%)" }} />
                <Tooltip
                  formatter={(value: number) => fmt(value)}
                  contentStyle={{
                    backgroundColor: "hsl(225, 14%, 11%)",
                    border: "1px solid hsl(225, 12%, 16%)",
                    borderRadius: "8px",
                    color: "hsl(210, 20%, 92%)",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  <Cell fill="hsl(142, 60%, 50%)" />
                  <Cell fill="hsl(0, 72%, 55%)" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top 5 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Top 5 Subcategorias de Maior Gasto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {top5.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono-code text-muted-foreground w-5">
                    #{i + 1}
                  </span>
                  <span className="text-sm">{item.name}</span>
                </div>
                <span className="text-sm font-mono-code font-medium text-destructive">
                  {fmt(item.amount)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
