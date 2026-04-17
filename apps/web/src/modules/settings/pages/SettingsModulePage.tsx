import { Bell, Link2, Save, ShieldCheck, UserCircle2 } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { SettingToggleRow } from "@/modules/settings/components";
import { useUserSettings } from "@/modules/settings/hooks";
import {
  USER_CURRENCY_OPTIONS,
  USER_TIMEZONE_OPTIONS,
  type UserSettings,
} from "@/modules/settings/model";

export function SettingsModulePage() {
  const { settings, isDirty, updateSettings, saveSettings, restoreDefaults } =
    useUserSettings();

  const handleSaveSettings = () => {
    const result = saveSettings();

    if (result === "missing_display_name") {
      toast.error("Informe um nome para o perfil");
      return;
    }

    if (result === "missing_email") {
      toast.error("Informe um e-mail válido");
      return;
    }

    toast.success("Configurações salvas");
  };

  const handleRestoreDefaults = () => {
    restoreDefaults();
    toast.success("Configurações restauradas para o padrão");
  };

  return (
    <AppLayout breadcrumbs={["SwissKit", "Configurações"]}>
      <div className="mx-auto max-w-7xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Preferências da Plataforma</CardTitle>
            <CardDescription>
              Ajuste identidade, notificações e integrações do seu fluxo pessoal.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button onClick={handleSaveSettings} disabled={!isDirty}>
              <Save className="h-4 w-4" />
              Salvar alterações
            </Button>
            <Button variant="outline" onClick={handleRestoreDefaults}>
              Restaurar padrão
            </Button>
          </CardContent>
        </Card>

        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <UserCircle2 className="h-4 w-4 text-brand" />
                Perfil e Região
              </CardTitle>
              <CardDescription>
                Dados de conta usados para personalizar a experiência.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="settings-display-name">Nome de exibição</Label>
                <Input
                  id="settings-display-name"
                  value={settings.displayName}
                  onChange={event =>
                    updateSettings("displayName", event.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="settings-email">E-mail</Label>
                <Input
                  id="settings-email"
                  type="email"
                  value={settings.email}
                  onChange={event => updateSettings("email", event.target.value)}
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Moeda padrão</Label>
                  <Select
                    value={settings.currency}
                    onValueChange={value =>
                      updateSettings(
                        "currency",
                        value as UserSettings["currency"],
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma moeda" />
                    </SelectTrigger>
                    <SelectContent>
                      {USER_CURRENCY_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Fuso horário</Label>
                  <Select
                    value={settings.timezone}
                    onValueChange={value => updateSettings("timezone", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um fuso" />
                    </SelectTrigger>
                    <SelectContent>
                      {USER_TIMEZONE_OPTIONS.map(timezone => (
                        <SelectItem key={timezone} value={timezone}>
                          {timezone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bell className="h-4 w-4 text-brand" />
                Notificações
              </CardTitle>
              <CardDescription>
                Controle como e quando deseja receber atualizações.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <SettingToggleRow
                label="Digest diário por e-mail"
                description="Resumo de movimentações e pendências no início do dia."
                checked={settings.digestByEmail}
                onCheckedChange={checked =>
                  updateSettings("digestByEmail", checked)
                }
              />
              <SettingToggleRow
                label="Alertas instantâneos"
                description="Sinalizar conflitos e eventos importantes em tempo real."
                checked={settings.instantAlerts}
                onCheckedChange={checked =>
                  updateSettings("instantAlerts", checked)
                }
              />
              <SettingToggleRow
                label="Resumo semanal"
                description="Enviar panorama consolidado de progresso toda sexta-feira."
                checked={settings.weeklySummary}
                onCheckedChange={checked =>
                  updateSettings("weeklySummary", checked)
                }
              />
              <SettingToggleRow
                label="Modo de tabela compacta"
                description="Reduz espaçamento para exibir mais linhas por tela."
                checked={settings.compactTables}
                onCheckedChange={checked =>
                  updateSettings("compactTables", checked)
                }
              />
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Link2 className="h-4 w-4 text-brand" />
                Integrações
              </CardTitle>
              <CardDescription>
                Ative serviços externos para sincronização de contexto.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <SettingToggleRow
                label="Google Calendar"
                description="Sincronizar lembretes de revisão e check-ins de rotina."
                checked={settings.googleCalendarSync}
                onCheckedChange={checked =>
                  updateSettings("googleCalendarSync", checked)
                }
              />
              <SettingToggleRow
                label="Notion"
                description="Publicar relatórios semanais em uma página dedicada."
                checked={settings.notionSync}
                onCheckedChange={checked => updateSettings("notionSync", checked)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ShieldCheck className="h-4 w-4 text-brand" />
                Segurança
              </CardTitle>
              <CardDescription>
                Ajustes de proteção da conta e comportamento de sessão.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <SettingToggleRow
                label="Autenticação em dois fatores"
                description="Adicionar camada extra de verificação ao entrar na plataforma."
                checked={settings.enable2fa}
                onCheckedChange={checked => updateSettings("enable2fa", checked)}
              />
              <div className="rounded-lg border border-border/70 bg-surface-subtle p-3">
                <p className="text-sm font-medium">Status de sessão</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Sessão protegida por login Google com cookie HttpOnly.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() =>
                    toast.success("Sessão atual marcada como confiável")
                  }
                >
                  Marcar dispositivo atual como confiável
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
