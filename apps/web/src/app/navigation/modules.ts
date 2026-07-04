import { Home, Settings, type LucideIcon } from "lucide-react";

export const MODULE_ROUTES = {
  core: "/app",
  settings: "/settings",
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
    id: "core",
    label: "Core",
    path: MODULE_ROUTES.core,
    icon: Home,
    description: "Ambiente base sem modulo de produto ativo.",
  },
  {
    id: "settings",
    label: "Settings",
    path: MODULE_ROUTES.settings,
    icon: Settings,
    description: "Preferencias e opcoes do template.",
  },
];

export const DEFAULT_MODULE_ROUTE = MODULE_ROUTES.core;
