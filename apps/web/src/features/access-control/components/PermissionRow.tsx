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
    <div className="flex flex-col gap-3 rounded-lg border border-border/50 bg-surface-subtle/20 px-4 py-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-1.5">
          <p className="text-sm font-semibold tracking-tight text-foreground">
            {getPermissionText(permission.key, "label", permission.label)}
          </p>
          {permission.description ? (
            <p className="text-xs leading-5 text-muted-foreground">
              {getPermissionText(
                permission.key,
                "description",
                permission.description,
              )}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          <PermissionActionBadge action={permission.action} />
          <PermissionKeyBadge
            permissionKey={permission.key}
            className="max-w-full break-all whitespace-normal"
          />
        </div>
      </div>
    </div>
  );
}
