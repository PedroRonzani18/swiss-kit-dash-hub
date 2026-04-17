import { Star, Wrench, Zap } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ToolsRoutineSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Rotina Recomendada</CardTitle>
        <CardDescription>
          Sequência sugerida para destravar o fluxo diário em menos de 10 minutos.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-3">
        <div className="rounded-lg border border-border/70 bg-surface-subtle p-3">
          <p className="flex items-center gap-2 text-sm font-medium">
            <Wrench className="h-4 w-4 text-brand" />
            Preparação
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Rode a conciliação financeira e confira alertas pendentes.
          </p>
        </div>
        <div className="rounded-lg border border-border/70 bg-surface-subtle p-3">
          <p className="flex items-center gap-2 text-sm font-medium">
            <Zap className="h-4 w-4 text-brand" />
            Execução
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Dispare uma sessão de foco para o item de maior impacto.
          </p>
        </div>
        <div className="rounded-lg border border-border/70 bg-surface-subtle p-3">
          <p className="flex items-center gap-2 text-sm font-medium">
            <Star className="h-4 w-4 text-brand" />
            Fechamento
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Faça revisão semanal e marque as ferramentas favoritas do dia.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
