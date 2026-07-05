import type { AccessControlOverviewContract } from "@swisskit/contracts/access-control";
import type {
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
