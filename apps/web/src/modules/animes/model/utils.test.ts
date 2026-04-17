import { describe, expect, it } from "vitest";
import { parseStoredAnimes } from "./utils";

describe("parseStoredAnimes", () => {
  it("returns null for invalid payload", () => {
    expect(parseStoredAnimes(null)).toBeNull();
    expect(parseStoredAnimes("{invalid}")).toBeNull();
    expect(parseStoredAnimes('"text"')).toBeNull();
  });

  it("normalizes numeric ranges and missing optional fields", () => {
    const raw = [
      {
        id: "a1",
        title: "Anime A",
        status: "watching",
        priority: "high",
        totalEpisodes: 12.8,
        episodesWatched: 99.1,
      },
    ];

    const parsed = parseStoredAnimes(JSON.stringify(raw));
    expect(parsed).not.toBeNull();
    expect(parsed?.[0]).toMatchObject({
      id: "a1",
      title: "Anime A",
      status: "watching",
      priority: "high",
      totalEpisodes: 12,
      episodesWatched: 12,
      genres: [],
    });
    expect(typeof parsed?.[0]?.updatedAt).toBe("string");
  });

  it("filters malformed entries", () => {
    const raw = [
      {
        id: "a1",
        title: "Anime A",
        status: "watching",
        priority: "high",
        totalEpisodes: 12,
        episodesWatched: 6,
      },
      {
        id: 123,
        title: "Anime B",
        status: "planned",
        priority: "low",
        totalEpisodes: 24,
        episodesWatched: 0,
      },
    ];

    const parsed = parseStoredAnimes(JSON.stringify(raw));
    expect(parsed).toHaveLength(1);
    expect(parsed?.[0]?.id).toBe("a1");
  });
});
