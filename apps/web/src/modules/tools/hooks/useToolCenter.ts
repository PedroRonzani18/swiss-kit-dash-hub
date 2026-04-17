import { useEffect, useMemo, useState } from "react";
import { readStorageItem, writeStorageItem } from "@/lib/storage";
import {
  buildRunSummary,
  createToolRunId,
  DEFAULT_FAVORITE_TOOL_IDS,
  FAVORITES_STORAGE_KEY,
  HISTORY_STORAGE_KEY,
  MAX_HISTORY_ITEMS,
  parseFavoriteToolIds,
  parseToolRuns,
  TOOL_CATALOG,
  type ToolDefinition,
  type ToolRun,
  type ToolRunStatus,
} from "@/modules/tools/model";

const RUN_WARNING_RATE = 0.22;

function createRunStatus(): ToolRunStatus {
  return Math.random() > RUN_WARNING_RATE ? "success" : "warning";
}

function createRunDurationMs(): number {
  return 200 + Math.floor(Math.random() * 2400);
}

export function useToolCenter() {
  const [search, setSearch] = useState("");
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([
    ...DEFAULT_FAVORITE_TOOL_IDS,
  ]);
  const [runs, setRuns] = useState<ToolRun[]>([]);

  useEffect(() => {
    const storedFavorites = parseFavoriteToolIds(
      readStorageItem(FAVORITES_STORAGE_KEY),
    );
    if (storedFavorites) {
      setFavorites(storedFavorites);
    }

    const storedRuns = parseToolRuns(readStorageItem(HISTORY_STORAGE_KEY));
    if (storedRuns) {
      setRuns(storedRuns);
    }
  }, []);

  useEffect(() => {
    writeStorageItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    writeStorageItem(HISTORY_STORAGE_KEY, JSON.stringify(runs));
  }, [runs]);

  const filteredTools = useMemo(
    () =>
      TOOL_CATALOG.filter(tool => {
        const hasTextMatch =
          !search ||
          tool.name.toLowerCase().includes(search.toLowerCase()) ||
          tool.description.toLowerCase().includes(search.toLowerCase()) ||
          tool.category.toLowerCase().includes(search.toLowerCase());

        if (!hasTextMatch) {
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
    setFavorites(previous => {
      if (previous.includes(toolId)) {
        return previous.filter(item => item !== toolId);
      }

      return [...previous, toolId];
    });
  };

  const runTool = (tool: ToolDefinition): ToolRunStatus => {
    const status = createRunStatus();
    const durationMs = createRunDurationMs();

    const nextRun: ToolRun = {
      id: createToolRunId(),
      toolId: tool.id,
      toolName: tool.name,
      startedAt: new Date().toISOString(),
      durationMs,
      status,
      summary: buildRunSummary(tool, status),
    };

    setRuns(previous => [nextRun, ...previous].slice(0, MAX_HISTORY_ITEMS));
    return status;
  };

  return {
    search,
    setSearch,
    onlyFavorites,
    setOnlyFavorites,
    favorites,
    runs,
    filteredTools,
    runsToday,
    toggleFavorite,
    runTool,
  };
}
