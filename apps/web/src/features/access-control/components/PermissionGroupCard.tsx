import type { AccessControlOverviewContract } from "@swisskit/contracts/access-control";

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
  return (
    <section className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-business-xs">
      <div className="flex flex-col gap-3 px-4 py-4 md:flex-row md:items-start md:justify-between md:px-5">
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {group.key}
          </p>
          <h3 className="text-sm font-semibold tracking-tight text-foreground">
            {getGroupText(group.key, "label", group.label)}
          </h3>
          {group.description ? (
            <p className="max-w-3xl text-xs leading-5 text-muted-foreground">
              {getGroupText(group.key, "description", group.description)}
            </p>
          ) : null}
        </div>
        <span className="rounded-full border border-border/50 bg-surface-subtle/35 px-3 py-1 text-xs text-muted-foreground">
          {groupCountLabel(group.permissions.length)}
        </span>
      </div>

      {group.permissions.length ? (
        <div className="space-y-3 border-t border-border/50 px-3 py-3 md:px-4 md:py-4">
          {group.permissions.map((permission) => (
            <PermissionRow
              key={permission.id}
              permission={permission}
              getPermissionText={getPermissionText}
            />
          ))}
        </div>
      ) : (
        <div className="mx-3 mb-3 rounded-lg border border-border/50 bg-surface-subtle/30 px-4 py-4 text-sm text-muted-foreground md:mx-4 md:mb-4">
          {emptyPermissionsLabel}
        </div>
      )}
    </section>
  );
}
