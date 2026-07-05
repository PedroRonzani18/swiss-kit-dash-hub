import type { AccessControlOverviewContract } from "@swisskit/contracts/access-control";

import { sortPermissionsForDisplay } from "../lib/access-control-view-model";
import { PermissionRow } from "./PermissionRow";

type PermissionGroup =
  AccessControlOverviewContract["permissionGroups"][number];

interface PermissionGroupCardProps {
  group: PermissionGroup;
  getGroupText: (
    key: string,
    field: "label" | "description",
    fallback: string,
  ) => string;
  getPermissionText: (
    key: string,
    field: "label" | "description",
    fallback: string,
  ) => string;
  emptyPermissionsLabel: string;
  groupCountLabel: (count: number) => string;
}

export function PermissionGroupCard({
  group,
  getGroupText,
  getPermissionText,
  emptyPermissionsLabel,
  groupCountLabel,
}: PermissionGroupCardProps) {
  const permissions = sortPermissionsForDisplay(group.permissions);

  return (
    <section className="overflow-hidden rounded-lg border border-border/70 bg-surface-subtle/35">
      <div className="flex flex-col gap-2 border-b border-border/70 px-4 py-4 md:flex-row md:items-start md:justify-between md:px-5">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-foreground">
            {getGroupText(group.key, "label", group.label)}
          </h3>
          {group.description ? (
            <p className="text-xs text-muted-foreground">
              {getGroupText(group.key, "description", group.description)}
            </p>
          ) : null}
        </div>
        <span className="text-xs text-muted-foreground">
          {groupCountLabel(group.permissions.length)}
        </span>
      </div>

      {permissions.length ? (
        <div>
          {permissions.map((permission) => (
            <PermissionRow
              key={permission.id}
              permission={permission}
              getPermissionText={getPermissionText}
            />
          ))}
        </div>
      ) : (
        <div className="px-4 py-4 text-sm text-muted-foreground md:px-5">
          {emptyPermissionsLabel}
        </div>
      )}
    </section>
  );
}
