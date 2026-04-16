import {
  Settings,
  Tv,
  Wallet,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export const MODULE_ROUTES = {
  finance: "/financeiro",
  animes: "/animes",
  tools: "/ferramentas",
  settings: "/configuracoes",
} as const;

export type ModuleRouteKey = keyof typeof MODULE_ROUTES;
export type ModulePath = (typeof MODULE_ROUTES)[ModuleRouteKey];

export type ModuleNavigationItem = {
  id: ModuleRouteKey;
  label: string;
  path: ModulePath;
  icon: LucideIcon;
  description: string;
};

export const APP_MODULES: ModuleNavigationItem[] = [
  {
    id: "finance",
    label: "Financeiro",
    path: MODULE_ROUTES.finance,
    icon: Wallet,
    description: "Controle contas, categorias e transacoes.",
  },
  {
    id: "animes",
    label: "Animes",
    path: MODULE_ROUTES.animes,
    icon: Tv,
    description: "Organize listas, progresso e backlog de animes.",
  },
  {
    id: "tools",
    label: "Ferramentas",
    path: MODULE_ROUTES.tools,
    icon: Wrench,
    description: "Acesse utilitarios e automacoes do dia a dia.",
  },
  {
    id: "settings",
    label: "Configuracoes",
    path: MODULE_ROUTES.settings,
    icon: Settings,
    description: "Ajuste preferencias e parametros da aplicacao.",
  },
];

export const DEFAULT_MODULE_ROUTE = MODULE_ROUTES.finance;
