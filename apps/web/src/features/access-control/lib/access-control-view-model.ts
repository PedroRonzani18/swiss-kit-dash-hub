import type { AccessControlOverviewContract } from "@swisskit/contracts/access-control";
import type {
  PermissionActionContract,
  PermissionGroupContract,
  PermissionContract,
  RoleContract,
} from "@swisskit/contracts/permissions";

export function getAccessControlSummary(
  data: AccessControlOverviewContract,
) {
  return {
    permissionsCount: data.permissions.length,
    rolesCount: data.roles.length,
    groupsCount: data.permissionGroups.length,
    managePermissionsCount: data.permissions.filter(
      (permission) => permission.action === "manage",
    ).length,
  };
}

export function sortRolesForDisplay(roles: RoleContract[]) {
  return [...roles].sort((left, right) => {
    const byPermissionCount =
      right.permissions.length - left.permissions.length;

    if (byPermissionCount !== 0) {
      return byPermissionCount;
    }

    const byLabel = left.label.localeCompare(right.label);

    if (byLabel !== 0) {
      return byLabel;
    }

    return left.key.localeCompare(right.key);
  });
}

export function sortPermissionsForDisplay(permissions: PermissionContract[]) {
  return [...permissions].sort((left, right) => {
    const byLabel = left.label.localeCompare(right.label);

    if (byLabel !== 0) {
      return byLabel;
    }

    return left.key.localeCompare(right.key);
  });
}

export type PermissionActionFilterValue = PermissionActionContract | "all";

type PermissionGroupForDisplay =
  AccessControlOverviewContract["permissionGroups"][number];

interface PermissionFilterOptions {
  search: string;
  action: PermissionActionFilterValue;
  resolveGroupText: (
    group: PermissionGroupContract,
  ) => { label: string; description: string };
  resolvePermissionText: (
    permission: PermissionContract,
  ) => { label: string; description: string };
}

interface RoleFilterOptions {
  search: string;
  resolveRoleText: (
    role: RoleContract,
  ) => { label: string; description: string };
}

export function normalizeAccessControlSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

export function filterPermissionGroupsForDisplay(
  groups: PermissionGroupForDisplay[],
  options: PermissionFilterOptions,
) {
  const normalizedSearch = normalizeAccessControlSearch(options.search);
  const hasSearch = normalizedSearch.length > 0;
  const hasActionFilter = options.action !== "all";
  const hasActiveFilters = hasSearch || hasActionFilter;

  return groups
    .map((group) => {
      const groupText = options.resolveGroupText(group);
      const permissions = sortPermissionsForDisplay(
        group.permissions.filter((permission) => {
          if (hasActionFilter && permission.action !== options.action) {
            return false;
          }

          if (!hasSearch) {
            return true;
          }

          const permissionText = options.resolvePermissionText(permission);
          const searchableText = normalizeAccessControlSearch(
            [
              permission.key,
              permission.action,
              permissionText.label,
              permissionText.description,
              group.key,
              groupText.label,
              groupText.description,
            ].join(" "),
          );

          return searchableText.includes(normalizedSearch);
        }),
      );

      return {
        ...group,
        permissions,
      };
    })
    .filter((group) => !hasActiveFilters || group.permissions.length > 0);
}

export function filterRolesForDisplay(
  roles: RoleContract[],
  options: RoleFilterOptions,
) {
  const normalizedSearch = normalizeAccessControlSearch(options.search);

  if (!normalizedSearch) {
    return sortRolesForDisplay(roles);
  }

  return sortRolesForDisplay(
    roles.filter((role) => {
      const roleText = options.resolveRoleText(role);
      const searchableText = normalizeAccessControlSearch(
        [
          role.key,
          roleText.label,
          roleText.description,
          ...role.permissions.map((permission) => permission.key),
        ].join(" "),
      );

      return searchableText.includes(normalizedSearch);
    }),
  );
}
