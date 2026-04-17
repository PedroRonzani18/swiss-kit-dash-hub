import type { AnimeSummary } from "@/modules/animes/model/types";

type AnimeSummaryCardsProps = {
  summary: AnimeSummary;
};

export function AnimeSummaryCards({ summary }: AnimeSummaryCardsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-lg border border-border/70 bg-surface-subtle p-3">
        <p className="text-xs text-muted-foreground">Assistindo</p>
        <p className="text-2xl font-semibold">{summary.watching}</p>
      </div>
      <div className="rounded-lg border border-border/70 bg-surface-subtle p-3">
        <p className="text-xs text-muted-foreground">Backlog</p>
        <p className="text-2xl font-semibold">{summary.planned}</p>
      </div>
      <div className="rounded-lg border border-border/70 bg-surface-subtle p-3">
        <p className="text-xs text-muted-foreground">Pausados</p>
        <p className="text-2xl font-semibold">{summary.paused}</p>
      </div>
      <div className="rounded-lg border border-border/70 bg-surface-subtle p-3">
        <p className="text-xs text-muted-foreground">Concluidos</p>
        <p className="text-2xl font-semibold">{summary.completed}</p>
      </div>
    </div>
  );
}
