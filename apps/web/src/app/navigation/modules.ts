import { Wallet, type LucideIcon } from "lucide-react";

export const MODULE_ROUTES = {
  finance: "/financeiro",
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
];

export const DEFAULT_MODULE_ROUTE = MODULE_ROUTES.finance;
