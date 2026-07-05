import type { ComponentType } from "react";
import type {
  AppModuleDefinitionContract,
  PermissionKeyContract,
} from "@swisskit/contracts";
import {
  Home,
  KeyRound,
  Settings,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { AccessListPage } from "@/modules/access-list/pages/AccessListPage";
import { AccessControlPage } from "@/modules/access-control/pages/AccessControlPage";
import { CoreAppPage } from "@/modules/core/pages/CoreAppPage";
import { SettingsPage } from "@/modules/settings/pages/SettingsPage";
import { UsersPage } from "@/modules/users/pages/UsersPage";

export const MODULE_ROUTES = {
  core: "/app",
  settings: "/settings",
  users: "/users",
  allowedEmails: "/allowed-emails",
  accessControl: "/access-control",
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
    requiredPermissions: ["core:access"],
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
    requiredPermissions: ["settings:access"],
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
    requiredPermissions: ["users:access"],
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
    requiredPermissions: ["allowed-emails:access"],
    description: "Emails liberados para acesso ao template.",
  },
  {
    id: "access-control",
    routeKey: "accessControl",
    label: "Access Control",
    path: MODULE_ROUTES.accessControl,
    icon: KeyRound,
    component: AccessControlPage,
    nav: true,
    status: "available",
    requiredPermissions: ["access-control:access"],
    description: "Catalogo local de permissoes do template.",
  },
];

export const ACTIVE_MODULES = APP_MODULES.filter(
  (module) => module.status === "available",
);

export const NAVIGATION_MODULES = ACTIVE_MODULES.filter((module) => module.nav);

export const PROTECTED_MODULE_ROUTES = ACTIVE_MODULES;

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

export function getNavigationModulesForUser(permissions: readonly string[]) {
  return NAVIGATION_MODULES.filter((module) =>
    canAccessModule(module, permissions),
  );
}

export function getProtectedModuleRoutesForUser(permissions: readonly string[]) {
  return PROTECTED_MODULE_ROUTES.filter((module) =>
    canAccessModule(module, permissions),
  );
}

export function getDefaultModuleRouteForUser(permissions: readonly string[]) {
  return getNavigationModulesForUser(permissions)[0]?.path ?? DEFAULT_MODULE_ROUTE;
}
