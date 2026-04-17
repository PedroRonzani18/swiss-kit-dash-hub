import { BookOpen, CheckCircle2, PauseCircle, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  PRIORITY_BADGE_VARIANT,
  PRIORITY_LABEL,
  STATUS_BADGE_VARIANT,
  STATUS_LABEL,
} from "@/modules/animes/model/constants";
import type { AnimeItem } from "@/modules/animes/model/types";

type AnimeCatalogItemCardProps = {
  anime: AnimeItem;
  onUpdateProgress: (id: string, delta: number) => void;
  onMarkAsCompleted: (id: string) => void;
  onTogglePause: (id: string) => void;
  onRemove: (id: string) => void;
};

export function AnimeCatalogItemCard({
  anime,
  onUpdateProgress,
  onMarkAsCompleted,
  onTogglePause,
  onRemove,
}: AnimeCatalogItemCardProps) {
  const progress =
    anime.totalEpisodes > 0
      ? (anime.episodesWatched / anime.totalEpisodes) * 100
      : 0;

  return (
    <div className="space-y-3 rounded-lg border border-border/70 bg-surface-subtle p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-medium">{anime.title}</p>
          <div className="mt-1 flex flex-wrap gap-1">
            <Badge variant={STATUS_BADGE_VARIANT[anime.status]}>
              {STATUS_LABEL[anime.status]}
            </Badge>
            <Badge variant={PRIORITY_BADGE_VARIANT[anime.priority]}>
              Prioridade {PRIORITY_LABEL[anime.priority]}
            </Badge>
            {anime.genres.map(genre => (
              <Badge key={`${anime.id}-${genre}`} variant="outline">
                {genre}
              </Badge>
            ))}
          </div>
        </div>
        <div className="text-right text-xs text-muted-foreground">
          <p className="font-medium">
            {anime.episodesWatched}/{anime.totalEpisodes} episodios
          </p>
          <p>Atualizado {new Date(anime.updatedAt).toLocaleDateString("pt-BR")}</p>
        </div>
      </div>

      <Progress value={progress} />

      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onUpdateProgress(anime.id, -1)}
          disabled={anime.episodesWatched <= 0}
        >
          -1 episodio
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onUpdateProgress(anime.id, 1)}
          disabled={anime.status === "completed"}
        >
          +1 episodio
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onMarkAsCompleted(anime.id)}
          disabled={anime.status === "completed"}
        >
          <CheckCircle2 className="h-4 w-4" />
          Concluir
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onTogglePause(anime.id)}
          disabled={anime.status === "planned" || anime.status === "completed"}
        >
          {anime.status === "paused" ? (
            <BookOpen className="h-4 w-4" />
          ) : (
            <PauseCircle className="h-4 w-4" />
          )}
          {anime.status === "paused" ? "Retomar" : "Pausar"}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="text-destructive hover:text-destructive"
          onClick={() => onRemove(anime.id)}
        >
          <Trash2 className="h-4 w-4" />
          Remover
        </Button>
      </div>
    </div>
  );
}
