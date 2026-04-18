import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart3, TrendingDown, TrendingUp, Wallet } from "lucide-react";

type AnalyticsSummaryCardsProps = {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  savingsRate: number;
  avgIncome: number;
  avgExpense: number;
  numMonths: number;
  formatCurrency: (value: number) => string;
};

export function AnalyticsSummaryCards({
  totalIncome,
  totalExpense,
  balance,
  savingsRate,
  avgIncome,
  avgExpense,
  numMonths,
  formatCurrency,
}: AnalyticsSummaryCardsProps) {
  return (
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
            {formatCurrency(totalIncome)}
          </p>
          <p className="mt-1 text-[10px] text-muted-foreground">
            Média: {formatCurrency(avgIncome)}/mês
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
            {formatCurrency(totalExpense)}
          </p>
          <p className="mt-1 text-[10px] text-muted-foreground">
            Média: {formatCurrency(avgExpense)}/mês
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
            {formatCurrency(balance)}
          </p>
          <p className="mt-1 text-[10px] text-muted-foreground">
            {numMonths} mês(es) selecionado(s)
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
  );
}
