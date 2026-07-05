import type { ComponentType } from "react";
import type {
  AppModuleDefinitionContract,
  PermissionKeyContract,
} from "@swisskit/contracts";
import { Home, Settings, ShieldCheck, Users, type LucideIcon } from "lucide-react";
import { AccessListPage } from "@/modules/access-list/pages/AccessListPage";
import { CoreAppPage } from "@/modules/core/pages/CoreAppPage";
import { SettingsPage } from "@/modules/settings/pages/SettingsPage";
import { UsersPage } from "@/modules/users/pages/UsersPage";

export const MODULE_ROUTES = {
  core: "/app",
  settings: "/settings",
  users: "/users",
  allowedEmails: "/allowed-emails",
} as const;

export type ModuleRouteKey = keyof typeof MODULE_ROUTES;
export type ModulePath = (typeof MODULE_ROUTES)[ModuleRouteKey];

export type ShellModuleDefinition = AppModuleDefinitionContract & {
  routeKey: ModuleRouteKey;
  path: ModulePath;
  icon: LucideIcon;
  description: string;
  component: ComponentType;
  requiredPermissions: PermissionKeyContract[];
};

export const APP_MODULES: ShellModuleDefinition[] = [
  {
    id: "core",
    routeKey: "core",
    label: "Core",
    path: MODULE_ROUTES.core,
    icon: Home,
    component: CoreAppPage,
    nav: true,
    status: "available",
    requiredPermissions: [],
    description: "Ambiente base sem modulo de produto ativo.",
  },
  {
    id: "settings",
    routeKey: "settings",
    label: "Settings",
    path: MODULE_ROUTES.settings,
    icon: Settings,
    component: SettingsPage,
    nav: true,
    status: "available",
    requiredPermissions: [],
    description: "Preferencias e opcoes do template.",
  },
  {
    id: "users",
    routeKey: "users",
    label: "Users",
    path: MODULE_ROUTES.users,
    icon: Users,
    component: UsersPage,
    nav: true,
    status: "available",
    requiredPermissions: [],
    description: "Usuarios autenticados do template.",
  },
  {
    id: "allowed-emails",
    routeKey: "allowedEmails",
    label: "Allowed Emails",
    path: MODULE_ROUTES.allowedEmails,
    icon: ShieldCheck,
    component: AccessListPage,
    nav: true,
    status: "available",
    requiredPermissions: [],
    description: "Emails liberados para acesso ao template.",
  },
];

export const NAVIGATION_MODULES = APP_MODULES.filter(
  (module) => module.nav && module.status === "available",
);

export const PROTECTED_MODULE_ROUTES = APP_MODULES.filter(
  (module) => module.status === "available",
);

export const DEFAULT_MODULE_ROUTE = MODULE_ROUTES.core;

export function hasRequiredPermissions(
  module: ShellModuleDefinition,
  permissions: readonly string[],
) {
  return module.requiredPermissions.every((permission) =>
    permissions.includes(permission),
  );
}

export function canAccessModule(
  module: ShellModuleDefinition,
  permissions: readonly string[] = [],
) {
  return hasRequiredPermissions(module, permissions);
}
