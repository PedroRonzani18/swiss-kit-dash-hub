import { ModulePlaceholderPage } from "@/modules/shared/ModulePlaceholderPage";

export function AnimesModulePage() {
  return (
    <ModulePlaceholderPage
      title="Animes"
      summary="Modulo reservado para catalogo, acompanhamento de episodios e planejamento de backlog."
      roadmapItems={[
        "Cadastrar e editar animes acompanhados",
        "Controlar progresso por episodio e temporada",
        "Priorizar backlog com filtros por genero e status",
      ]}
    />
  );
}
