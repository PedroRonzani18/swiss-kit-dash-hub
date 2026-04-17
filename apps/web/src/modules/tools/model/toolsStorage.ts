import type { ToolRun } from "./tools";

const TOOL_RUN_STATUS_SET = new Set(["success", "warning"]);

export function parseFavoriteToolIds(serialized: string | null): string[] | null {
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

export function parseToolRuns(serialized: string | null): ToolRun[] | null {
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
          typeof item.summary === "string" &&
          typeof item.status === "string" &&
          TOOL_RUN_STATUS_SET.has(item.status),
      )
      .map(
        item =>
          ({
            id: item.id,
            toolId: item.toolId,
            toolName: item.toolName,
            startedAt: item.startedAt,
            durationMs: item.durationMs,
            status: item.status,
            summary: item.summary,
          }) satisfies ToolRun,
      );
  } catch {
    return null;
  }
}
