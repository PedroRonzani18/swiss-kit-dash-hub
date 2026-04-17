import { BookOpen, CheckCircle2, Clock3 } from "lucide-react";
import type { AnimeSummary } from "@/modules/animes/model/types";

type AnimeRadarCardsProps = {
  summary: AnimeSummary;
};

export function AnimeRadarCards({ summary }: AnimeRadarCardsProps) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      <div className="rounded-lg border border-border/70 bg-surface-subtle p-3">
        <p className="flex items-center gap-2 text-sm font-medium">
          <BookOpen className="h-4 w-4 text-brand" />
          Em andamento
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {summary.watching} titulo(s) em ritmo ativo.
        </p>
      </div>
      <div className="rounded-lg border border-border/70 bg-surface-subtle p-3">
        <p className="flex items-center gap-2 text-sm font-medium">
          <Clock3 className="h-4 w-4 text-brand" />
          Fila planejada
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {summary.planned} titulo(s) aguardando inicio.
        </p>
      </div>
      <div className="rounded-lg border border-border/70 bg-surface-subtle p-3">
        <p className="flex items-center gap-2 text-sm font-medium">
          <CheckCircle2 className="h-4 w-4 text-brand" />
          Entregues
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {summary.completed} titulo(s) concluidos no catalogo.
        </p>
      </div>
    </div>
  );
}
