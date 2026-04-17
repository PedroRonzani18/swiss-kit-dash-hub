import { Plus, Search } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AnimeBacklogPreview,
  AnimeCatalogItemCard,
  AnimeRadarCards,
  AnimeSummaryCards,
} from "@/modules/animes/components";
import { useAnimeCatalog } from "@/modules/animes/hooks";
import type {
  AnimePriority,
  AnimeStatus,
  AnimeStatusFilter,
} from "@/modules/animes/model";

export function AnimesModulePage() {
  const {
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
  } = useAnimeCatalog();

  return (
    <AppLayout breadcrumbs={["SwissKit", "Animes"]}>
      <div className="mx-auto max-w-7xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Hub de Animes</CardTitle>
            <CardDescription>
              Catalogo com progresso de episodios e fila de backlog priorizada.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnimeSummaryCards summary={summary} />
          </CardContent>
        </Card>

        <div className="grid gap- xl:grid-cols-[360px_1fr]">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Novo Anime</CardTitle>
              <CardDescription>
                Cadastre rapidamente um titulo para acompanhar.
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
                  placeholder="Episodios"
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
                    <SelectItem value="medium">Prioridade media</SelectItem>
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
                  <SelectItem value="completed">Concluido</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Generos (separe por virgula)"
                value={genresInput}
                onChange={event => setGenresInput(event.target.value)}
              />
              <Button className="w-full" onClick={addAnime}>
                <Plus className="h-4 w-4" />
                Adicionar Anime
              </Button>

              <AnimeBacklogPreview backlog={backlog} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Catalogo</CardTitle>
              <CardDescription>
                Filtre por status e atualize progresso por episodio.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <div className="relative min-w-56 flex-1">
                  <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-8"
                    placeholder="Buscar por titulo ou genero"
                    value={search}
                    onChange={event => setSearch(event.target.value)}
                  />
                </div>
                <Select
                  value={statusFilter}
                  onValueChange={value => setStatusFilter(value as AnimeStatusFilter)}
                >
                  <SelectTrigger className="w-[190px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="watching">Assistindo</SelectItem>
                    <SelectItem value="planned">Backlog</SelectItem>
                    <SelectItem value="paused">Pausado</SelectItem>
                    <SelectItem value="completed">Concluido</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                {filteredAnimes.length === 0 && (
                  <div className="rounded-lg border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
                    Nenhum anime encontrado para os filtros atuais.
                  </div>
                )}

                {filteredAnimes.map(item => (
                  <AnimeCatalogItemCard
                    key={item.id}
                    anime={item}
                    onUpdateProgress={updateProgress}
                    onMarkAsCompleted={markAsCompleted}
                    onTogglePause={togglePause}
                    onRemove={removeAnime}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Radar de Consumo</CardTitle>
            <CardDescription>
              Snapshot rapido para decidir o que assistir hoje.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnimeRadarCards summary={summary} />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
