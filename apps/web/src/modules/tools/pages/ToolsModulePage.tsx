import { AppLayout } from "@/components/AppLayout";
import { toast } from "@/components/ui/sonner";
import {
  ToolsCatalogSection,
  ToolsHistorySection,
  ToolsRoutineSection,
  ToolsSummaryCards,
} from "@/modules/tools/components";
import { useToolCenter } from "@/modules/tools/hooks";
import { TOOL_CATALOG, type ToolDefinition } from "@/modules/tools/model";

export function ToolsModulePage() {
  const {
    search,
    setSearch,
    onlyFavorites,
    setOnlyFavorites,
    favorites,
    runs,
    filteredTools,
    runsToday,
    toggleFavorite,
    runTool,
  } = useToolCenter();

  const handleRunTool = (tool: ToolDefinition) => {
    const status = runTool(tool);

    if (status === "success") {
      toast.success(`${tool.name} executada com sucesso`);
      return;
    }

    toast.warning(`${tool.name} executada com observações`);
  };

  return (
    <AppLayout breadcrumbs={["SwissKit", "Ferramentas"]}>
      <div className="mx-auto max-w-7xl space-y-6">
        <ToolsSummaryCards
          totalTools={TOOL_CATALOG.length}
          favoriteCount={favorites.length}
          runsToday={runsToday}
        />

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <ToolsCatalogSection
            search={search}
            onSearchChange={setSearch}
            onlyFavorites={onlyFavorites}
            onOnlyFavoritesChange={setOnlyFavorites}
            favorites={favorites}
            tools={filteredTools}
            onRunTool={handleRunTool}
            onToggleFavorite={toggleFavorite}
          />
          <ToolsHistorySection runs={runs} />
        </div>

        <ToolsRoutineSection />
      </div>
    </AppLayout>
  );
}
