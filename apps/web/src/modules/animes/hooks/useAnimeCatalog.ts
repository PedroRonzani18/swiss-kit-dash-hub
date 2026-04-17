import { useEffect, useMemo, useState } from "react";
import { toast } from "@/components/ui/sonner";
import {
  ANIME_STORAGE_KEY,
  INITIAL_ANIMES,
  PRIORITY_WEIGHT,
  STATUS_SORT_WEIGHT,
} from "@/modules/animes/model/constants";
import { clampEpisodes, createAnimeId, parseStoredAnimes } from "@/modules/animes/model/utils";
import type {
  AnimeItem,
  AnimePriority,
  AnimeStatus,
  AnimeStatusFilter,
  AnimeSummary,
} from "@/modules/animes/model/types";

export type UseAnimeCatalogResult = {
  animes: AnimeItem[];
  summary: AnimeSummary;
  backlog: AnimeItem[];
  filteredAnimes: AnimeItem[];
  title: string;
  totalEpisodes: string;
  status: AnimeStatus;
  priority: AnimePriority;
  genresInput: string;
  search: string;
  statusFilter: AnimeStatusFilter;
  setTitle: (value: string) => void;
  setTotalEpisodes: (value: string) => void;
  setStatus: (value: AnimeStatus) => void;
  setPriority: (value: AnimePriority) => void;
  setGenresInput: (value: string) => void;
  setSearch: (value: string) => void;
  setStatusFilter: (value: AnimeStatusFilter) => void;
  addAnime: () => void;
  updateProgress: (id: string, delta: number) => void;
  togglePause: (id: string) => void;
  markAsCompleted: (id: string) => void;
  removeAnime: (id: string) => void;
};

export function useAnimeCatalog(): UseAnimeCatalogResult {
  const [animes, setAnimes] = useState<AnimeItem[]>(INITIAL_ANIMES);
  const [title, setTitle] = useState("");
  const [totalEpisodes, setTotalEpisodes] = useState("12");
  const [status, setStatus] = useState<AnimeStatus>("planned");
  const [priority, setPriority] = useState<AnimePriority>("medium");
  const [genresInput, setGenresInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<AnimeStatusFilter>("all");

  useEffect(() => {
    const stored = parseStoredAnimes(localStorage.getItem(ANIME_STORAGE_KEY));
    if (stored && stored.length > 0) {
      setAnimes(stored);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(ANIME_STORAGE_KEY, JSON.stringify(animes));
  }, [animes]);

  const summary = useMemo(() => {
    const watching = animes.filter(item => item.status === "watching").length;
    const planned = animes.filter(item => item.status === "planned").length;
    const completed = animes.filter(item => item.status === "completed").length;
    const paused = animes.filter(item => item.status === "paused").length;

    return { watching, planned, completed, paused };
  }, [animes]);

  const backlog = useMemo(
    () =>
      animes
        .filter(item => item.status === "planned")
        .sort((a, b) => {
          const priorityDiff = PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
          if (priorityDiff !== 0) {
            return priorityDiff;
          }

          return a.title.localeCompare(b.title);
        }),
    [animes],
  );

  const filteredAnimes = useMemo(
    () =>
      animes
        .filter(item => {
          if (
            search &&
            !item.title.toLowerCase().includes(search.toLowerCase()) &&
            !item.genres.some(genre => genre.toLowerCase().includes(search.toLowerCase()))
          ) {
            return false;
          }

          if (statusFilter !== "all" && item.status !== statusFilter) {
            return false;
          }

          return true;
        })
        .sort((a, b) => {
          const statusDiff = STATUS_SORT_WEIGHT[a.status] - STATUS_SORT_WEIGHT[b.status];
          if (statusDiff !== 0) {
            return statusDiff;
          }

          const priorityDiff = PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
          if (priorityDiff !== 0) {
            return priorityDiff;
          }

          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        }),
    [animes, search, statusFilter],
  );

  const addAnime = () => {
    const normalizedTitle = title.trim();
    if (!normalizedTitle) {
      toast.error("Informe o nome do anime");
      return;
    }

    const alreadyExists = animes.some(
      item => item.title.toLowerCase() === normalizedTitle.toLowerCase(),
    );

    if (alreadyExists) {
      toast.error("Esse anime ja esta no catalogo");
      return;
    }

    const parsedTotalEpisodes = Math.max(
      1,
      Number.isNaN(Number(totalEpisodes)) ? 1 : Math.trunc(Number(totalEpisodes)),
    );

    const parsedGenres = genresInput
      .split(",")
      .map(item => item.trim())
      .filter(Boolean);

    const watched = status === "completed" ? parsedTotalEpisodes : 0;

    const nextAnime: AnimeItem = {
      id: createAnimeId(),
      title: normalizedTitle,
      status,
      priority,
      totalEpisodes: parsedTotalEpisodes,
      episodesWatched: watched,
      genres: parsedGenres,
      updatedAt: new Date().toISOString(),
    };

    setAnimes(prev => [nextAnime, ...prev]);
    setTitle("");
    setTotalEpisodes("12");
    setStatus("planned");
    setPriority("medium");
    setGenresInput("");
    toast.success("Anime adicionado ao catalogo");
  };

  const updateAnime = (id: string, updater: (item: AnimeItem) => AnimeItem) => {
    setAnimes(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...updater(item),
              updatedAt: new Date().toISOString(),
            }
          : item,
      ),
    );
  };

  const updateProgress = (id: string, delta: number) => {
    updateAnime(id, item => {
      const episodesWatched = clampEpisodes(
        item.episodesWatched + delta,
        item.totalEpisodes,
      );

      let nextStatus = item.status;
      if (episodesWatched >= item.totalEpisodes) {
        nextStatus = "completed";
      } else if (episodesWatched > 0 && item.status !== "paused") {
        nextStatus = "watching";
      } else if (episodesWatched === 0 && item.status === "watching") {
        nextStatus = "planned";
      }

      return {
        ...item,
        episodesWatched,
        status: nextStatus,
      };
    });
  };

  const togglePause = (id: string) => {
    updateAnime(id, item => {
      if (item.status === "completed" || item.status === "planned") {
        return item;
      }

      return {
        ...item,
        status: item.status === "paused" ? "watching" : "paused",
      };
    });
  };

  const markAsCompleted = (id: string) => {
    updateAnime(id, item => ({
      ...item,
      status: "completed",
      episodesWatched: item.totalEpisodes,
    }));

    toast.success("Anime marcado como concluido");
  };

  const removeAnime = (id: string) => {
    setAnimes(prev => prev.filter(item => item.id !== id));
    toast.success("Anime removido do catalogo");
  };

  return {
    animes,
    summary,
    backlog,
    filteredAnimes,
    title,
    totalEpisodes,
    status,
    priority,
    genresInput,
    search,
    statusFilter,
    setTitle,
    setTotalEpisodes,
    setStatus,
    setPriority,
    setGenresInput,
    setSearch,
    setStatusFilter,
    addAnime,
    updateProgress,
    togglePause,
    markAsCompleted,
    removeAnime,
  };
}
