import type { PermissionContract } from "@swisskit/contracts/permissions";

import { PermissionActionBadge } from "./PermissionActionBadge";
import { PermissionKeyBadge } from "./PermissionKeyBadge";

interface PermissionRowProps {
  permission: PermissionContract;
  getPermissionText: (
    key: string,
    field: "label" | "description",
    fallback: string,
  ) => string;
}

export function PermissionRow({
  permission,
  getPermissionText,
}: PermissionRowProps) {
  return (
    <div className="flex flex-col gap-3 border-t border-border/70 px-4 py-4 first:border-t-0 md:px-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">
            {getPermissionText(permission.key, "label", permission.label)}
          </p>
          {permission.description ? (
            <p className="text-xs text-muted-foreground">
              {getPermissionText(
                permission.key,
                "description",
                permission.description,
              )}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <PermissionActionBadge action={permission.action} />
          <PermissionKeyBadge permissionKey={permission.key} />
        </div>
      </div>
    </div>
  );
}
