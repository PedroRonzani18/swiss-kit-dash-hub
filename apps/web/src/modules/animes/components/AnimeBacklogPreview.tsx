import { Badge } from "@/components/ui/badge";
import {
  PRIORITY_BADGE_VARIANT,
  PRIORITY_LABEL,
} from "@/modules/animes/model/constants";
import type { AnimeItem } from "@/modules/animes/model/types";

type AnimeBacklogPreviewProps = {
  backlog: AnimeItem[];
};

export function AnimeBacklogPreview({ backlog }: AnimeBacklogPreviewProps) {
  return (
    <div className="space-y-2 rounded-lg border border-border/70 bg-surface-subtle p-3">
      <p className="text-sm font-medium">Backlog Prioritario</p>
      {backlog.length === 0 && (
        <p className="text-sm text-muted-foreground">Nenhum anime no backlog.</p>
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
  );
}
