import { describe, expect, it } from "vitest";
import { parseFavoriteToolIds, parseToolRuns } from "./toolsStorage";

describe("toolsStorage", () => {
  describe("parseFavoriteToolIds", () => {
    it("returns null for invalid payload", () => {
      expect(parseFavoriteToolIds(null)).toBeNull();
      expect(parseFavoriteToolIds("{invalid}")).toBeNull();
      expect(parseFavoriteToolIds('"text"')).toBeNull();
    });

    it("keeps only string ids", () => {
      expect(
        parseFavoriteToolIds(JSON.stringify(["a", 123, "b", false])),
      ).toEqual(["a", "b"]);
    });
  });

  describe("parseToolRuns", () => {
    it("returns null for invalid payload", () => {
      expect(parseToolRuns(null)).toBeNull();
      expect(parseToolRuns("[]{}")).toBeNull();
      expect(parseToolRuns('"text"')).toBeNull();
    });

    it("filters malformed entries and keeps valid runs", () => {
      const payload = [
        {
          id: "run-1",
          toolId: "tool-1",
          toolName: "Tool 1",
          startedAt: "2026-01-01T12:00:00.000Z",
          durationMs: 1200,
          status: "success",
          summary: "ok",
        },
        {
          id: "run-2",
          toolId: "tool-2",
          toolName: "Tool 2",
          startedAt: "2026-01-02T12:00:00.000Z",
          durationMs: 1300,
          status: "oops",
          summary: "invalid-status",
        },
      ];

      expect(parseToolRuns(JSON.stringify(payload))).toEqual([payload[0]]);
    });
  });
});
