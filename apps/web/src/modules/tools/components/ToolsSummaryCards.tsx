import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type ToolsSummaryCardsProps = {
  totalTools: number;
  favoriteCount: number;
  runsToday: number;
};

export function ToolsSummaryCards({
  totalTools,
  favoriteCount,
  runsToday,
}: ToolsSummaryCardsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Central de Ferramentas</CardTitle>
        <CardDescription>
          Acesse utilitários rápidos, acompanhe execuções e fixe favoritos.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-border/70 bg-surface-subtle p-3">
          <p className="text-xs text-muted-foreground">Ferramentas ativas</p>
          <p className="text-2xl font-semibold">{totalTools}</p>
        </div>
        <div className="rounded-lg border border-border/70 bg-surface-subtle p-3">
          <p className="text-xs text-muted-foreground">Favoritas</p>
          <p className="text-2xl font-semibold">{favoriteCount}</p>
        </div>
        <div className="rounded-lg border border-border/70 bg-surface-subtle p-3">
          <p className="text-xs text-muted-foreground">Execuções hoje</p>
          <p className="text-2xl font-semibold">{runsToday}</p>
        </div>
      </CardContent>
    </Card>
  );
}
