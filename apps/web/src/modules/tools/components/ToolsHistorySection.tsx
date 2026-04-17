import { Clock3, History } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ToolRun } from "@/modules/tools/model";

type ToolsHistorySectionProps = {
  runs: ToolRun[];
};

export function ToolsHistorySection({ runs }: ToolsHistorySectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Histórico de Execuções</CardTitle>
        <CardDescription>
          Registro das últimas automações disparadas neste módulo.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {runs.length === 0 && (
          <div className="rounded-lg border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
            Execute uma ferramenta para iniciar o histórico.
          </div>
        )}

        {runs.slice(0, 12).map(run => (
          <div
            key={run.id}
            className="space-y-2 rounded-lg border border-border/70 bg-surface-subtle p-3"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium">{run.toolName}</p>
              <Badge variant={run.status === "success" ? "success" : "warning"}>
                {run.status === "success" ? "Ok" : "Revisar"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{run.summary}</p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Clock3 className="h-3 w-3" />
                {Math.max(1, Math.round(run.durationMs / 100)) / 10}s
              </span>
              <span className="inline-flex items-center gap-1">
                <History className="h-3 w-3" />
                {new Date(run.startedAt).toLocaleString("pt-BR")}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
