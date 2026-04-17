import type {
  AnimeItem,
  AnimePriority,
  AnimePriorityBadgeVariant,
  AnimeStatus,
  AnimeStatusBadgeVariant,
} from "./types";

export const ANIME_STORAGE_KEY = "swisskit.module.animes.v1";

export const ANIME_STATUS_VALUES = [
  "watching",
  "planned",
  "paused",
  "completed",
] as const satisfies readonly AnimeStatus[];

export const ANIME_PRIORITY_VALUES = [
  "high",
  "medium",
  "low",
] as const satisfies readonly AnimePriority[];

export const STATUS_LABEL: Record<AnimeStatus, string> = {
  watching: "Assistindo",
  planned: "Backlog",
  paused: "Pausado",
  completed: "Concluido",
};

export const PRIORITY_LABEL: Record<AnimePriority, string> = {
  high: "Alta",
  medium: "Media",
  low: "Baixa",
};

export const PRIORITY_WEIGHT: Record<AnimePriority, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

export const STATUS_SORT_WEIGHT: Record<AnimeStatus, number> = {
  watching: 0,
  planned: 1,
  paused: 2,
  completed: 3,
};

export const STATUS_BADGE_VARIANT: Record<AnimeStatus, AnimeStatusBadgeVariant> = {
  watching: "success",
  planned: "info",
  paused: "warning",
  completed: "default",
};

export const PRIORITY_BADGE_VARIANT: Record<
  AnimePriority,
  AnimePriorityBadgeVariant
> = {
  high: "warning",
  medium: "secondary",
  low: "outline",
};

export const INITIAL_ANIMES: AnimeItem[] = [
  {
    id: "anime-one-piece",
    title: "One Piece",
    status: "watching",
    priority: "high",
    totalEpisodes: 1100,
    episodesWatched: 430,
    genres: ["Aventura", "Shounen"],
    updatedAt: "2026-04-16T21:40:00.000Z",
  },
  {
    id: "anime-solo-leveling",
    title: "Solo Leveling",
    status: "planned",
    priority: "high",
    totalEpisodes: 24,
    episodesWatched: 0,
    genres: ["Acao", "Fantasia"],
    updatedAt: "2026-04-15T19:05:00.000Z",
  },
  {
    id: "anime-hxh",
    title: "Hunter x Hunter",
    status: "paused",
    priority: "medium",
    totalEpisodes: 148,
    episodesWatched: 76,
    genres: ["Aventura"],
    updatedAt: "2026-04-12T11:30:00.000Z",
  },
];
