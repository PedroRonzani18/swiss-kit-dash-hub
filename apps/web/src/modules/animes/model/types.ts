import type { BadgeProps } from "@/components/ui/badge";

export type AnimeStatus = "watching" | "planned" | "paused" | "completed";
export type AnimePriority = "high" | "medium" | "low";

export type AnimeItem = {
  id: string;
  title: string;
  status: AnimeStatus;
  priority: AnimePriority;
  totalEpisodes: number;
  episodesWatched: number;
  genres: string[];
  updatedAt: string;
};

export type AnimeSummary = {
  watching: number;
  planned: number;
  paused: number;
  completed: number;
};

export type AnimeStatusFilter = "all" | AnimeStatus;

export type AnimeStatusBadgeVariant = NonNullable<BadgeProps["variant"]>;
export type AnimePriorityBadgeVariant = NonNullable<BadgeProps["variant"]>;
