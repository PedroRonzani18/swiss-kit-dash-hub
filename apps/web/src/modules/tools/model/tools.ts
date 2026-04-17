export type ToolDefinition = {
  id: string;
  name: string;
  category: string;
  description: string;
  commandHint: string;
};

export type ToolRunStatus = "success" | "warning";

export type ToolRun = {
  id: string;
  toolId: string;
  toolName: string;
  startedAt: string;
  durationMs: number;
  status: ToolRunStatus;
  summary: string;
};

export const FAVORITES_STORAGE_KEY = "swisskit.module.tools.favorites.v1";
export const HISTORY_STORAGE_KEY = "swisskit.module.tools.history.v1";
export const MAX_HISTORY_ITEMS = 30;

export const DEFAULT_FAVORITE_TOOL_IDS = [
  "finance-reconcile",
  "weekly-review",
] as const;

export const TOOL_CATALOG: ToolDefinition[] = [
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

export function createToolRunId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `tool-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function buildRunSummary(
  tool: ToolDefinition,
  status: ToolRunStatus,
): string {
  if (status === "success") {
    return `${tool.name} concluída sem bloqueios.`;
  }

  return `${tool.name} concluída com itens para revisão manual.`;
}
