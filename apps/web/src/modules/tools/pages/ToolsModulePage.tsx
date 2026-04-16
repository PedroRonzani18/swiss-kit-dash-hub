import { ModulePlaceholderPage } from "@/modules/shared/ModulePlaceholderPage";

export function ToolsModulePage() {
  return (
    <ModulePlaceholderPage
      title="Ferramentas"
      summary="Modulo reservado para utilitarios e automacoes reutilizaveis no seu fluxo pessoal."
      roadmapItems={[
        "Centralizar utilitarios em cards acionaveis",
        "Criar historico de execucoes para cada ferramenta",
        "Adicionar favoritos para acesso rapido no dashboard",
      ]}
    />
  );
}
