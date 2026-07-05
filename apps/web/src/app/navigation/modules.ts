import type { ComponentType } from "react";
import type {
  AppModuleDefinitionContract,
  PermissionKeyContract,
} from "@swisskit/contracts";
import {
  ClipboardList,
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
import { TasksPage } from "@/modules/tasks/pages/TasksPage";
import { UsersPage } from "@/modules/users/pages/UsersPage";

export const MODULE_ROUTES = {
  core: "/app",
  settings: "/settings",
  users: "/users",
  allowedEmails: "/allowed-emails",
  accessControl: "/access-control",
  tasks: "/tasks",
} as const;

export type ModuleRouteKey = keyof typeof MODULE_ROUTES;
export type ModulePath = (typeof MODULE_ROUTES)[ModuleRouteKey];

export type ShellModuleDefinition = Omit<
  AppModuleDefinitionContract,
  "label" | "description"
> & {
  routeKey: ModuleRouteKey;
  path: ModulePath;
  icon: LucideIcon;
  labelKey: string;
  descriptionKey: string;
  component: ComponentType;
  requiredPermissions: PermissionKeyContract[];
};

export const APP_MODULES: ShellModuleDefinition[] = [
  {
    id: "core",
    routeKey: "core",
    labelKey: "navigation.modules.core.label",
    path: MODULE_ROUTES.core,
    icon: Home,
    component: CoreAppPage,
    nav: true,
    status: "available",
    requiredPermissions: ["core:access"],
    descriptionKey: "navigation.modules.core.description",
  },
  {
    id: "settings",
    routeKey: "settings",
    labelKey: "navigation.modules.settings.label",
    path: MODULE_ROUTES.settings,
    icon: Settings,
    component: SettingsPage,
    nav: true,
    status: "available",
    requiredPermissions: ["settings:access"],
    descriptionKey: "navigation.modules.settings.description",
  },
  {
    id: "users",
    routeKey: "users",
    labelKey: "navigation.modules.users.label",
    path: MODULE_ROUTES.users,
    icon: Users,
    component: UsersPage,
    nav: true,
    status: "available",
    requiredPermissions: ["users:access"],
    descriptionKey: "navigation.modules.users.description",
  },
  {
    id: "allowed-emails",
    routeKey: "allowedEmails",
    labelKey: "navigation.modules.allowedEmails.label",
    path: MODULE_ROUTES.allowedEmails,
    icon: ShieldCheck,
    component: AccessListPage,
    nav: true,
    status: "available",
    requiredPermissions: ["allowed-emails:access"],
    descriptionKey: "navigation.modules.allowedEmails.description",
  },
  {
    id: "access-control",
    routeKey: "accessControl",
    labelKey: "navigation.modules.accessControl.label",
    path: MODULE_ROUTES.accessControl,
    icon: KeyRound,
    component: AccessControlPage,
    nav: true,
    status: "available",
    requiredPermissions: ["access-control:access"],
    descriptionKey: "navigation.modules.accessControl.description",
  },
  {
    id: "tasks",
    routeKey: "tasks",
    labelKey: "navigation.modules.tasks.label",
    path: MODULE_ROUTES.tasks,
    icon: ClipboardList,
    component: TasksPage,
    nav: true,
    status: "available",
    requiredPermissions: ["tasks:access"],
    descriptionKey: "navigation.modules.tasks.description",
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
