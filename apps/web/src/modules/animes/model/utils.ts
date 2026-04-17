import {
  ANIME_PRIORITY_VALUES,
  ANIME_STATUS_VALUES,
} from "./constants";
import type { AnimeItem, AnimePriority, AnimeStatus } from "./types";

const STATUS_SET = new Set<string>(ANIME_STATUS_VALUES);
const PRIORITY_SET = new Set<string>(ANIME_PRIORITY_VALUES);

export function isAnimeStatus(value: unknown): value is AnimeStatus {
  return typeof value === "string" && STATUS_SET.has(value);
}

export function isAnimePriority(value: unknown): value is AnimePriority {
  return typeof value === "string" && PRIORITY_SET.has(value);
}

export function createAnimeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `anime-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function clampEpisodes(value: number, total: number) {
  return Math.min(Math.max(value, 0), total);
}

export function parseStoredAnimes(serialized: string | null): AnimeItem[] | null {
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
          typeof item.title === "string" &&
          isAnimeStatus(item.status) &&
          isAnimePriority(item.priority) &&
          typeof item.totalEpisodes === "number" &&
          typeof item.episodesWatched === "number",
      )
      .map(item => {
        const totalEpisodes = Math.max(1, Math.trunc(item.totalEpisodes));
        const episodesWatched = clampEpisodes(
          Math.trunc(item.episodesWatched),
          totalEpisodes,
        );

        return {
          id: item.id,
          title: item.title,
          status: item.status,
          priority: item.priority,
          totalEpisodes,
          episodesWatched,
          genres: Array.isArray(item.genres)
            ? item.genres.filter((genre: unknown) => typeof genre === "string")
            : [],
          updatedAt:
            typeof item.updatedAt === "string"
              ? item.updatedAt
              : new Date().toISOString(),
        } satisfies AnimeItem;
      });
  } catch {
    return null;
  }
}
