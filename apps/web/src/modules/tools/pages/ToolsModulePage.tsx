import { useEffect, useMemo, useState } from "react";
import {
  Clock3,
  History,
  PlayCircle,
  Search,
  Star,
  Wrench,
  Zap,
} from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";

type ToolDefinition = {
  id: string;
  name: string;
  category: string;
  description: string;
  commandHint: string;
};

type ToolRun = {
  id: string;
  toolId: string;
  toolName: string;
  startedAt: string;
  durationMs: number;
  status: "success" | "warning";
  summary: string;
};

const FAVORITES_STORAGE_KEY = "swisskit.module.tools.favorites.v1";
const HISTORY_STORAGE_KEY = "swisskit.module.tools.history.v1";
const MAX_HISTORY_ITEMS = 30;

const TOOL_CATALOG: ToolDefinition[] = [
  {
    id: "finance-reconcile",
    name: "Conciliação Financeira",
    category: "Financeiro",
    description:
      "Revisa transações sem categoria e sugere ajustes para fechar o fluxo mensal.",
    commandHint: "finance.reconcile --month current",
  },
  {
    id: "payday-checklist",
    name: "Checklist de Pagamento",
    category: "Rotina",
    description:
      "Gera sequência de ações para dia de pagamento com prioridade por impacto.",
    commandHint: "routine.payday-checklist --priority high",
  },
  {
    id: "focus-session",
    name: "Sessão de Foco",
    category: "Produtividade",
    description:
      "Dispara bloco de foco com timer e contexto da tarefa atual para reduzir troca de contexto.",
    commandHint: "productivity.focus --duration 50",
  },
  {
    id: "quick-journal",
    name: "Diário Rápido",
    category: "Pessoal",
    description:
      "Captura resumo do dia com tags e sinais de energia para consulta semanal.",
    commandHint: "journal.capture --template daily",
  },
  {
    id: "weekly-review",
    name: "Revisão Semanal",
    category: "Planejamento",
    description:
      "Compila metas, pendências e bloqueios para preparar a semana seguinte.",
    commandHint: "planning.weekly-review --next-week true",
  },
];

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `tool-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function parseFavorites(serialized: string | null): string[] | null {
  if (!serialized) {
    return null;
  }

  try {
    const parsed = JSON.parse(serialized);
    if (!Array.isArray(parsed)) {
      return null;
    }

    return parsed.filter(item => typeof item === "string");
  } catch {
    return null;
  }
}

function parseRuns(serialized: string | null): ToolRun[] | null {
  if (!serialized) {
    return null;
  }

  try {
    const parsed = JSON.parse(serialized);
    if (!Array.isArray(parsed)) {
      return null;
    }

    return parsed
      .filter(
        item =>
          item &&
          typeof item.id === "string" &&
          typeof item.toolId === "string" &&
          typeof item.toolName === "string" &&
          typeof item.startedAt === "string" &&
          typeof item.durationMs === "number" &&
          typeof item.status === "string" &&
          typeof item.summary === "string",
      )
      .map(
        item =>
          ({
            id: item.id,
            toolId: item.toolId,
            toolName: item.toolName,
            startedAt: item.startedAt,
            durationMs: item.durationMs,
            status: item.status as "success" | "warning",
            summary: item.summary,
          }) satisfies ToolRun,
      );
  } catch {
    return null;
  }
}

function buildRunSummary(tool: ToolDefinition, status: "success" | "warning") {
  if (status === "success") {
    return `${tool.name} concluída sem bloqueios.`;
  }

  return `${tool.name} concluída com itens para revisão manual.`;
}

export function ToolsModulePage() {
  const [search, setSearch] = useState("");
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([
    "finance-reconcile",
    "weekly-review",
  ]);
  const [runs, setRuns] = useState<ToolRun[]>([]);

  useEffect(() => {
    const storedFavorites = parseFavorites(
      localStorage.getItem(FAVORITES_STORAGE_KEY),
    );
    if (storedFavorites) {
      setFavorites(storedFavorites);
    }

    const storedRuns = parseRuns(localStorage.getItem(HISTORY_STORAGE_KEY));
    if (storedRuns) {
      setRuns(storedRuns);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(runs));
  }, [runs]);

  const filteredTools = useMemo(
    () =>
      TOOL_CATALOG.filter(tool => {
        if (
          search &&
          !tool.name.toLowerCase().includes(search.toLowerCase()) &&
          !tool.description.toLowerCase().includes(search.toLowerCase()) &&
          !tool.category.toLowerCase().includes(search.toLowerCase())
        ) {
          return false;
        }

        if (onlyFavorites && !favorites.includes(tool.id)) {
          return false;
        }

        return true;
      }),
    [favorites, onlyFavorites, search],
  );

  const runsToday = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return runs.filter(item => item.startedAt.startsWith(today)).length;
  }, [runs]);

  const toggleFavorite = (toolId: string) => {
    setFavorites(prev => {
      if (prev.includes(toolId)) {
        return prev.filter(item => item !== toolId);
      }
      return [...prev, toolId];
    });
  };

  const executeTool = (tool: ToolDefinition) => {
    const status = Math.random() > 0.22 ? "success" : "warning";
    const durationMs = 200 + Math.floor(Math.random() * 2400);

    const nextRun: ToolRun = {
      id: createId(),
      toolId: tool.id,
      toolName: tool.name,
      startedAt: new Date().toISOString(),
      durationMs,
      status,
      summary: buildRunSummary(tool, status),
    };

    setRuns(prev => [nextRun, ...prev].slice(0, MAX_HISTORY_ITEMS));

    if (status === "success") {
      toast.success(`${tool.name} executada com sucesso`);
    } else {
      toast.warning(`${tool.name} executada com observações`);
    }
  };

  return (
    <AppLayout breadcrumbs={["SwissKit", "Ferramentas"]}>
      <div className="mx-auto max-w-7xl space-y-6">
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
              <p className="text-2xl font-semibold">{TOOL_CATALOG.length}</p>
            </div>
            <div className="rounded-lg border border-border/70 bg-surface-subtle p-3">
              <p className="text-xs text-muted-foreground">Favoritas</p>
              <p className="text-2xl font-semibold">{favorites.length}</p>
            </div>
            <div className="rounded-lg border border-border/70 bg-surface-subtle p-3">
              <p className="text-xs text-muted-foreground">Execuções hoje</p>
              <p className="text-2xl font-semibold">{runsToday}</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 xl:grid-cols-[1.15fr,0.85fr]">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Catálogo</CardTitle>
              <CardDescription>
                Execute uma rotina com um clique e mantenha apenas o que usa.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative min-w-56 flex-1">
                  <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={event => setSearch(event.target.value)}
                    className="pl-8"
                    placeholder="Buscar por ferramenta, categoria ou descrição"
                  />
                </div>
                <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <Checkbox
                    checked={onlyFavorites}
                    onCheckedChange={value => setOnlyFavorites(Boolean(value))}
                  />
                  Apenas favoritas
                </label>
              </div>

              <div className="grid gap-3 lg:grid-cols-2">
                {filteredTools.length === 0 && (
                  <div className="col-span-full rounded-lg border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
                    Nenhuma ferramenta encontrada para os filtros atuais.
                  </div>
                )}

                {filteredTools.map(tool => {
                  const isFavorite = favorites.includes(tool.id);

                  return (
                    <div
                      key={tool.id}
                      className="space-y-3 rounded-lg border border-border/70 bg-surface-subtle p-4"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate font-medium">{tool.name}</p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {tool.description}
                          </p>
                        </div>
                        <Badge variant="secondary">{tool.category}</Badge>
                      </div>

                      <p className="rounded bg-background px-2 py-1 font-mono text-xs text-muted-foreground">
                        {tool.commandHint}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" onClick={() => executeTool(tool)}>
                          <PlayCircle className="h-4 w-4" />
                          Executar
                        </Button>
                        <Button
                          size="sm"
                          variant={isFavorite ? "soft" : "outline"}
                          onClick={() => toggleFavorite(tool.id)}
                        >
                          <Star
                            className={`h-4 w-4 ${
                              isFavorite
                                ? "fill-current text-brand"
                                : "text-muted-foreground"
                            }`}
                          />
                          {isFavorite ? "Favorita" : "Favoritar"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

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
                    <Badge
                      variant={run.status === "success" ? "success" : "warning"}
                    >
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
        </div>

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
      </div>
    </AppLayout>
  );
}
