import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Clock3,
  PauseCircle,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";

type AnimeStatus = "watching" | "planned" | "paused" | "completed";
type AnimePriority = "high" | "medium" | "low";

type AnimeItem = {
  id: string;
  title: string;
  status: AnimeStatus;
  priority: AnimePriority;
  totalEpisodes: number;
  episodesWatched: number;
  genres: string[];
  updatedAt: string;
};

const STORAGE_KEY = "swisskit.module.animes.v1";

const STATUS_LABEL: Record<AnimeStatus, string> = {
  watching: "Assistindo",
  planned: "Backlog",
  paused: "Pausado",
  completed: "Concluído",
};

const PRIORITY_LABEL: Record<AnimePriority, string> = {
  high: "Alta",
  medium: "Média",
  low: "Baixa",
};

const PRIORITY_WEIGHT: Record<AnimePriority, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

const STATUS_BADGE_VARIANT: Record<
  AnimeStatus,
  NonNullable<BadgeProps["variant"]>
> = {
  watching: "success",
  planned: "info",
  paused: "warning",
  completed: "default",
};

const PRIORITY_BADGE_VARIANT: Record<
  AnimePriority,
  NonNullable<BadgeProps["variant"]>
> = {
  high: "warning",
  medium: "secondary",
  low: "outline",
};

const INITIAL_ANIMES: AnimeItem[] = [
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
    genres: ["Ação", "Fantasia"],
    updatedAt: "2026-04-15T19:05:00.000Z",
  },
  {
    id: "anime-hxH",
    title: "Hunter x Hunter",
    status: "paused",
    priority: "medium",
    totalEpisodes: 148,
    episodesWatched: 76,
    genres: ["Aventura"],
    updatedAt: "2026-04-12T11:30:00.000Z",
  },
];

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `anime-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function clampEpisodes(value: number, total: number) {
  return Math.min(Math.max(value, 0), total);
}

function parseStoredAnimes(serialized: string | null): AnimeItem[] | null {
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
          typeof item.status === "string" &&
          typeof item.priority === "string" &&
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
          status: item.status as AnimeStatus,
          priority: item.priority as AnimePriority,
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

export function AnimesModulePage() {
  const [animes, setAnimes] = useState<AnimeItem[]>(INITIAL_ANIMES);
  const [title, setTitle] = useState("");
  const [totalEpisodes, setTotalEpisodes] = useState("12");
  const [status, setStatus] = useState<AnimeStatus>("planned");
  const [priority, setPriority] = useState<AnimePriority>("medium");
  const [genresInput, setGenresInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | AnimeStatus>("all");

  useEffect(() => {
    const stored = parseStoredAnimes(localStorage.getItem(STORAGE_KEY));
    if (stored && stored.length > 0) {
      setAnimes(stored);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(animes));
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
            !item.genres.some(genre =>
              genre.toLowerCase().includes(search.toLowerCase()),
            )
          ) {
            return false;
          }

          if (statusFilter !== "all" && item.status !== statusFilter) {
            return false;
          }

          return true;
        })
        .sort((a, b) => {
          const statusPriority = {
            watching: 0,
            planned: 1,
            paused: 2,
            completed: 3,
          } as const;

          const statusDiff = statusPriority[a.status] - statusPriority[b.status];
          if (statusDiff !== 0) {
            return statusDiff;
          }

          const priorityDiff = PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
          if (priorityDiff !== 0) {
            return priorityDiff;
          }

          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
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
      toast.error("Esse anime já está no catálogo");
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
      id: createId(),
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
    toast.success("Anime adicionado ao catálogo");
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
    toast.success("Anime marcado como concluído");
  };

  const removeAnime = (id: string) => {
    setAnimes(prev => prev.filter(item => item.id !== id));
    toast.success("Anime removido do catálogo");
  };

  return (
    <AppLayout breadcrumbs={["SwissKit", "Animes"]}>
      <div className="mx-auto max-w-7xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Hub de Animes</CardTitle>
            <CardDescription>
              Catálogo com progresso de episódios e fila de backlog priorizada.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-border/70 bg-surface-subtle p-3">
              <p className="text-xs text-muted-foreground">Assistindo</p>
              <p className="text-2xl font-semibold">{summary.watching}</p>
            </div>
            <div className="rounded-lg border border-border/70 bg-surface-subtle p-3">
              <p className="text-xs text-muted-foreground">Backlog</p>
              <p className="text-2xl font-semibold">{summary.planned}</p>
            </div>
            <div className="rounded-lg border border-border/70 bg-surface-subtle p-3">
              <p className="text-xs text-muted-foreground">Pausados</p>
              <p className="text-2xl font-semibold">{summary.paused}</p>
            </div>
            <div className="rounded-lg border border-border/70 bg-surface-subtle p-3">
              <p className="text-xs text-muted-foreground">Concluídos</p>
              <p className="text-2xl font-semibold">{summary.completed}</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 xl:grid-cols-[360px,1fr]">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Novo Anime</CardTitle>
              <CardDescription>
                Cadastre rapidamente um título para acompanhar.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                placeholder="Nome do anime"
                value={title}
                onChange={event => setTitle(event.target.value)}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="number"
                  min={1}
                  placeholder="Episódios"
                  value={totalEpisodes}
                  onChange={event => setTotalEpisodes(event.target.value)}
                />
                <Select
                  value={priority}
                  onValueChange={value => setPriority(value as AnimePriority)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">Prioridade alta</SelectItem>
                    <SelectItem value="medium">Prioridade média</SelectItem>
                    <SelectItem value="low">Prioridade baixa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Select
                value={status}
                onValueChange={value => setStatus(value as AnimeStatus)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status inicial" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planned">Backlog</SelectItem>
                  <SelectItem value="watching">Assistindo</SelectItem>
                  <SelectItem value="paused">Pausado</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Gêneros (separe por vírgula)"
                value={genresInput}
                onChange={event => setGenresInput(event.target.value)}
              />
              <Button className="w-full" onClick={addAnime}>
                <Plus className="h-4 w-4" />
                Adicionar Anime
              </Button>

              <div className="space-y-2 rounded-lg border border-border/70 bg-surface-subtle p-3">
                <p className="text-sm font-medium">Backlog Prioritário</p>
                {backlog.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Nenhum anime no backlog.
                  </p>
                )}
                {backlog.slice(0, 5).map(item => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-md bg-background px-2 py-1.5"
                  >
                    <span className="truncate text-sm">{item.title}</span>
                    <Badge
                      variant={PRIORITY_BADGE_VARIANT[item.priority]}
                      className="text-[10px]"
                    >
                      {PRIORITY_LABEL[item.priority]}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Catálogo</CardTitle>
              <CardDescription>
                Filtre por status e atualize progresso por episódio.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <div className="relative min-w-56 flex-1">
                  <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-8"
                    placeholder="Buscar por título ou gênero"
                    value={search}
                    onChange={event => setSearch(event.target.value)}
                  />
                </div>
                <Select
                  value={statusFilter}
                  onValueChange={value => setStatusFilter(value as "all" | AnimeStatus)}
                >
                  <SelectTrigger className="w-[190px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="watching">Assistindo</SelectItem>
                    <SelectItem value="planned">Backlog</SelectItem>
                    <SelectItem value="paused">Pausado</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                {filteredAnimes.length === 0 && (
                  <div className="rounded-lg border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
                    Nenhum anime encontrado para os filtros atuais.
                  </div>
                )}

                {filteredAnimes.map(item => {
                  const progress =
                    item.totalEpisodes > 0
                      ? (item.episodesWatched / item.totalEpisodes) * 100
                      : 0;

                  return (
                    <div
                      key={item.id}
                      className="space-y-3 rounded-lg border border-border/70 bg-surface-subtle p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate font-medium">{item.title}</p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            <Badge variant={STATUS_BADGE_VARIANT[item.status]}>
                              {STATUS_LABEL[item.status]}
                            </Badge>
                            <Badge variant={PRIORITY_BADGE_VARIANT[item.priority]}>
                              Prioridade {PRIORITY_LABEL[item.priority]}
                            </Badge>
                            {item.genres.map(genre => (
                              <Badge key={`${item.id}-${genre}`} variant="outline">
                                {genre}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-right text-xs text-muted-foreground">
                          <p className="font-medium">
                            {item.episodesWatched}/{item.totalEpisodes} episódios
                          </p>
                          <p>
                            Atualizado{" "}
                            {new Date(item.updatedAt).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      </div>

                      <Progress value={progress} />

                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateProgress(item.id, -1)}
                          disabled={item.episodesWatched <= 0}
                        >
                          -1 episódio
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateProgress(item.id, 1)}
                          disabled={item.status === "completed"}
                        >
                          +1 episódio
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markAsCompleted(item.id)}
                          disabled={item.status === "completed"}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Concluir
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => togglePause(item.id)}
                          disabled={
                            item.status === "planned" || item.status === "completed"
                          }
                        >
                          {item.status === "paused" ? (
                            <BookOpen className="h-4 w-4" />
                          ) : (
                            <PauseCircle className="h-4 w-4" />
                          )}
                          {item.status === "paused" ? "Retomar" : "Pausar"}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          onClick={() => removeAnime(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Remover
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Radar de Consumo</CardTitle>
            <CardDescription>
              Snapshot rápido para decidir o que assistir hoje.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3">
            <div className="rounded-lg border border-border/70 bg-surface-subtle p-3">
              <p className="flex items-center gap-2 text-sm font-medium">
                <BookOpen className="h-4 w-4 text-brand" />
                Em andamento
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {summary.watching} título(s) em ritmo ativo.
              </p>
            </div>
            <div className="rounded-lg border border-border/70 bg-surface-subtle p-3">
              <p className="flex items-center gap-2 text-sm font-medium">
                <Clock3 className="h-4 w-4 text-brand" />
                Fila planejada
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {summary.planned} título(s) aguardando início.
              </p>
            </div>
            <div className="rounded-lg border border-border/70 bg-surface-subtle p-3">
              <p className="flex items-center gap-2 text-sm font-medium">
                <CheckCircle2 className="h-4 w-4 text-brand" />
                Entregues
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {summary.completed} título(s) concluídos no catálogo.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
