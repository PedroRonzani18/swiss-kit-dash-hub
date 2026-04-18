import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronDown, ChevronRight, TrendingDown, TrendingUp } from "lucide-react";
import type {
  AnalyticsTypeFilter,
  CategoryBreakdownEntry,
} from "@/features/finance/model/analytics";

type AnalyticsCategoryBreakdownProps = {
  typeFilter: AnalyticsTypeFilter;
  incomeCategories: CategoryBreakdownEntry[];
  expenseCategories: CategoryBreakdownEntry[];
  expandedCategories: Set<string>;
  totalIncome: number;
  totalExpense: number;
  toggleExpanded: (categoryId: string) => void;
  formatCurrency: (value: number) => string;
  formatPercent: (value: number, total: number) => string;
};

type CategoryCardProps = {
  title: string;
  icon: "income" | "expense";
  categories: CategoryBreakdownEntry[];
  expandedCategories: Set<string>;
  total: number;
  totalLabel: string;
  emptyText: string;
  colorClassName: string;
  progressClassName: string;
  subProgressClassName: string;
  toggleExpanded: (categoryId: string) => void;
  formatCurrency: (value: number) => string;
  formatPercent: (value: number, total: number) => string;
};

function CategoryCard({
  title,
  icon,
  categories,
  expandedCategories,
  total,
  totalLabel,
  emptyText,
  colorClassName,
  progressClassName,
  subProgressClassName,
  toggleExpanded,
  formatCurrency,
  formatPercent,
}: CategoryCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          {icon === "income" ? (
            <TrendingUp className={`h-4 w-4 ${colorClassName}`} />
          ) : (
            <TrendingDown className={`h-4 w-4 ${colorClassName}`} />
          )}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {categories.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            {emptyText}
          </p>
        ) : (
          <div className="space-y-1">
            <div className="grid grid-cols-[1fr_100px_60px_80px] gap-2 border-b border-border px-2 pb-1 text-[10px] font-medium text-muted-foreground">
              <span>Categoria</span>
              <span className="text-right">Valor</span>
              <span className="text-right">%</span>
              <span></span>
            </div>
            {categories.map(({ cat, total: categoryTotal, subs }) => (
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
                  <span className={`text-right font-mono text-sm ${colorClassName}`}>
                    {formatCurrency(categoryTotal)}
                  </span>
                  <span className="text-right text-xs text-muted-foreground">
                    {formatPercent(categoryTotal, total)}
                  </span>
                  <Progress
                    value={(categoryTotal / total) * 100}
                    className={`h-1.5 ${progressClassName}`}
                  />
                </button>
                {expandedCategories.has(cat.id) &&
                  subs.map((sub) => (
                    <div
                      key={sub.id}
                      className="grid grid-cols-[1fr_100px_60px_80px] items-center gap-2 px-2 py-1 pl-8"
                    >
                      <span className="text-xs text-muted-foreground">
                        {sub.name}
                      </span>
                      <span className="text-right font-mono text-xs">
                        {formatCurrency(sub.total)}
                      </span>
                      <span className="text-right text-[10px] text-muted-foreground">
                        {formatPercent(sub.total, total)}
                      </span>
                      <Progress
                        value={(sub.total / total) * 100}
                        className={`h-1 ${subProgressClassName}`}
                      />
                    </div>
                  ))}
              </div>
            ))}
            <div className="grid grid-cols-[1fr_100px_60px_80px] gap-2 border-t border-border px-2 pt-2">
              <span className="text-sm font-bold">{totalLabel}</span>
              <span className={`text-right font-mono text-sm font-bold ${colorClassName}`}>
                {formatCurrency(total)}
              </span>
              <span className="text-right text-xs">100%</span>
              <span></span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function AnalyticsCategoryBreakdown({
  typeFilter,
  incomeCategories,
  expenseCategories,
  expandedCategories,
  totalIncome,
  totalExpense,
  toggleExpanded,
  formatCurrency,
  formatPercent,
}: AnalyticsCategoryBreakdownProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {(typeFilter === "all" || typeFilter === "income") && (
        <CategoryCard
          title="Receitas por Categoria"
          icon="income"
          categories={incomeCategories}
          expandedCategories={expandedCategories}
          total={totalIncome}
          totalLabel="Total Receitas"
          emptyText="Sem dados de receita no período."
          colorClassName="text-status-success"
          progressClassName="[&>div]:bg-status-success"
          subProgressClassName="[&>div]:bg-status-success/60"
          toggleExpanded={toggleExpanded}
          formatCurrency={formatCurrency}
          formatPercent={formatPercent}
        />
      )}
      {(typeFilter === "all" || typeFilter === "expense") && (
        <CategoryCard
          title="Despesas por Categoria"
          icon="expense"
          categories={expenseCategories}
          expandedCategories={expandedCategories}
          total={totalExpense}
          totalLabel="Total Despesas"
          emptyText="Sem dados de despesa no período."
          colorClassName="text-destructive"
          progressClassName="[&>div]:bg-destructive"
          subProgressClassName="[&>div]:bg-destructive/60"
          toggleExpanded={toggleExpanded}
          formatCurrency={formatCurrency}
          formatPercent={formatPercent}
        />
      )}
    </div>
  );
}
