import { useEffect, useMemo, useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/sonner";

type UserSettings = {
  displayName: string;
  email: string;
  timezone: string;
  currency: "BRL" | "USD" | "EUR";
  digestByEmail: boolean;
  instantAlerts: boolean;
  weeklySummary: boolean;
  compactTables: boolean;
  enable2fa: boolean;
  googleCalendarSync: boolean;
  notionSync: boolean;
};

const STORAGE_KEY = "swisskit.module.settings.v1";

const DEFAULT_SETTINGS: UserSettings = {
  displayName: "Pedro Ronzani",
  email: "pedro@example.com",
  timezone: "America/Sao_Paulo",
  currency: "BRL",
  digestByEmail: true,
  instantAlerts: true,
  weeklySummary: true,
  compactTables: false,
  enable2fa: false,
  googleCalendarSync: false,
  notionSync: false,
};

function parseStoredSettings(serialized: string | null): UserSettings | null {
  if (!serialized) {
    return null;
  }

  try {
    const parsed = JSON.parse(serialized);
    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    return {
      displayName:
        typeof parsed.displayName === "string"
          ? parsed.displayName
          : DEFAULT_SETTINGS.displayName,
      email:
        typeof parsed.email === "string" ? parsed.email : DEFAULT_SETTINGS.email,
      timezone:
        typeof parsed.timezone === "string"
          ? parsed.timezone
          : DEFAULT_SETTINGS.timezone,
      currency:
        parsed.currency === "USD" || parsed.currency === "EUR"
          ? parsed.currency
          : "BRL",
      digestByEmail: Boolean(parsed.digestByEmail),
      instantAlerts: Boolean(parsed.instantAlerts),
      weeklySummary: Boolean(parsed.weeklySummary),
      compactTables: Boolean(parsed.compactTables),
      enable2fa: Boolean(parsed.enable2fa),
      googleCalendarSync: Boolean(parsed.googleCalendarSync),
      notionSync: Boolean(parsed.notionSync),
    };
  } catch {
    return null;
  }
}

type ToggleRowProps = {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

function ToggleRow({
  label,
  description,
  checked,
  onCheckedChange,
}: ToggleRowProps) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border border-border/70 bg-surface-subtle p-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

export function SettingsModulePage() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [savedSnapshot, setSavedSnapshot] = useState(
    JSON.stringify(DEFAULT_SETTINGS),
  );

  useEffect(() => {
    const stored = parseStoredSettings(localStorage.getItem(STORAGE_KEY));
    if (!stored) {
      return;
    }

    setSettings(stored);
    setSavedSnapshot(JSON.stringify(stored));
  }, []);

  const isDirty = useMemo(
    () => JSON.stringify(settings) !== savedSnapshot,
    [savedSnapshot, settings],
  );

  const updateSettings = <K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K],
  ) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const saveSettings = () => {
    if (!settings.displayName.trim()) {
      toast.error("Informe um nome para o perfil");
      return;
    }

    if (!settings.email.trim()) {
      toast.error("Informe um e-mail válido");
      return;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setSavedSnapshot(JSON.stringify(settings));
    toast.success("Configurações salvas");
  };

  const restoreDefaults = () => {
    setSettings(DEFAULT_SETTINGS);
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
            <Button onClick={saveSettings} disabled={!isDirty}>
              <Save className="h-4 w-4" />
              Salvar alterações
            </Button>
            <Button variant="outline" onClick={restoreDefaults}>
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
                      <SelectItem value="BRL">BRL (R$)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
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
                      <SelectItem value="America/Sao_Paulo">
                        America/Sao_Paulo
                      </SelectItem>
                      <SelectItem value="America/New_York">
                        America/New_York
                      </SelectItem>
                      <SelectItem value="Europe/Lisbon">Europe/Lisbon</SelectItem>
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
              <ToggleRow
                label="Digest diário por e-mail"
                description="Resumo de movimentações e pendências no início do dia."
                checked={settings.digestByEmail}
                onCheckedChange={checked =>
                  updateSettings("digestByEmail", checked)
                }
              />
              <ToggleRow
                label="Alertas instantâneos"
                description="Sinalizar conflitos e eventos importantes em tempo real."
                checked={settings.instantAlerts}
                onCheckedChange={checked =>
                  updateSettings("instantAlerts", checked)
                }
              />
              <ToggleRow
                label="Resumo semanal"
                description="Enviar panorama consolidado de progresso toda sexta-feira."
                checked={settings.weeklySummary}
                onCheckedChange={checked =>
                  updateSettings("weeklySummary", checked)
                }
              />
              <ToggleRow
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
              <ToggleRow
                label="Google Calendar"
                description="Sincronizar lembretes de revisão e check-ins de rotina."
                checked={settings.googleCalendarSync}
                onCheckedChange={checked =>
                  updateSettings("googleCalendarSync", checked)
                }
              />
              <ToggleRow
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
              <ToggleRow
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
                  onClick={() => toast.success("Sessão atual marcada como confiável")}
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
