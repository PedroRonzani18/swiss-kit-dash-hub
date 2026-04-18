import { Wallet, type LucideIcon } from "lucide-react";
import { FINANCE_MODULE_ROUTE } from "@/features/finance";

export const MODULE_ROUTES = {
  finance: FINANCE_MODULE_ROUTE,
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
