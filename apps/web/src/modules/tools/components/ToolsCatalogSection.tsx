import { PlayCircle, Search, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import type { ToolDefinition } from "@/modules/tools/model";

type ToolsCatalogSectionProps = {
  search: string;
  onSearchChange: (value: string) => void;
  onlyFavorites: boolean;
  onOnlyFavoritesChange: (value: boolean) => void;
  favorites: string[];
  tools: ToolDefinition[];
  onRunTool: (tool: ToolDefinition) => void;
  onToggleFavorite: (toolId: string) => void;
};

export function ToolsCatalogSection({
  search,
  onSearchChange,
  onlyFavorites,
  onOnlyFavoritesChange,
  favorites,
  tools,
  onRunTool,
  onToggleFavorite,
}: ToolsCatalogSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Catálogo</CardTitle>
        <CardDescription>
          Execute uma rotina com um clique e mantenha apenas o que usa.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-56 flex-1">
            <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={event => onSearchChange(event.target.value)}
              className="pl-8"
              placeholder="Buscar por ferramenta, categoria ou descrição"
            />
          </div>
          <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Checkbox
              checked={onlyFavorites}
              onCheckedChange={value => onOnlyFavoritesChange(Boolean(value))}
            />
            Apenas favoritas
          </label>
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          {tools.length === 0 && (
            <div className="col-span-full rounded-lg border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
              Nenhuma ferramenta encontrada para os filtros atuais.
            </div>
          )}

          {tools.map(tool => {
            const isFavorite = favorites.includes(tool.id);

            return (
              <div
                key={tool.id}
                className="space-y-3 rounded-lg border border-border/70 bg-surface-subtle p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{tool.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {tool.description}
                    </p>
                  </div>
                  <Badge variant="secondary">{tool.category}</Badge>
                </div>

                <p className="rounded bg-background px-2 py-1 font-mono text-xs text-muted-foreground">
                  {tool.commandHint}
                </p>

                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => onRunTool(tool)}>
                    <PlayCircle className="h-4 w-4" />
                    Executar
                  </Button>
                  <Button
                    size="sm"
                    variant={isFavorite ? "soft" : "outline"}
                    onClick={() => onToggleFavorite(tool.id)}
                  >
                    <Star
                      className={`h-4 w-4 ${
                        isFavorite
                          ? "fill-current text-brand"
                          : "text-muted-foreground"
                      }`}
                    />
                    {isFavorite ? "Favorita" : "Favoritar"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
