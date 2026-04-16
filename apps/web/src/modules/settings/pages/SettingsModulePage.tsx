import { ModulePlaceholderPage } from "@/modules/shared/ModulePlaceholderPage";

export function SettingsModulePage() {
  return (
    <ModulePlaceholderPage
      title="Configuracoes"
      summary="Modulo reservado para preferencias globais da aplicacao e opcoes de conta."
      roadmapItems={[
        "Gerenciar perfil e preferencias visuais",
        "Configurar alertas e notificacoes",
        "Controlar integracoes e seguranca da conta",
      ]}
    />
  );
}
