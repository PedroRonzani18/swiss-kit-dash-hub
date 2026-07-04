import { Home, Settings, ShieldCheck, Users, type LucideIcon } from "lucide-react";

export const MODULE_ROUTES = {
  core: "/app",
  settings: "/settings",
  users: "/users",
  accessList: "/allowed-emails",
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
  {
    id: "users",
    label: "Users",
    path: MODULE_ROUTES.users,
    icon: Users,
    description: "Usuarios autenticados do template.",
  },
  {
    id: "accessList",
    label: "Allowed Emails",
    path: MODULE_ROUTES.accessList,
    icon: ShieldCheck,
    description: "Emails liberados para acesso ao template.",
  },
];

export const DEFAULT_MODULE_ROUTE = MODULE_ROUTES.core;
