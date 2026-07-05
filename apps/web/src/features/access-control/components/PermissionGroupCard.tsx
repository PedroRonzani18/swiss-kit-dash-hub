import type { AccessControlOverviewContract } from "@swisskit/contracts/access-control";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
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
  expandLabel: (groupLabel: string) => string;
  collapseLabel: (groupLabel: string) => string;
  forceExpandedOnMobile: boolean;
}

export function PermissionGroupCard({
  group,
  getGroupText,
  getPermissionText,
  emptyPermissionsLabel,
  groupCountLabel,
  expandLabel,
  collapseLabel,
  forceExpandedOnMobile,
}: PermissionGroupCardProps) {
  const [isExpandedOnMobile, setIsExpandedOnMobile] = useState(false);
  const groupLabel = getGroupText(group.key, "label", group.label);
  const groupDescription = group.description
    ? getGroupText(group.key, "description", group.description)
    : null;
  const isMobileBodyVisible = forceExpandedOnMobile || isExpandedOnMobile;

  return (
    <section className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-business-xs">
      <button
        type="button"
        className="flex w-full items-start justify-between gap-3 px-4 py-4 text-left sm:hidden"
        onClick={() => setIsExpandedOnMobile((value) => !value)}
        aria-expanded={isMobileBodyVisible}
        aria-label={
          isMobileBodyVisible
            ? collapseLabel(groupLabel)
            : expandLabel(groupLabel)
        }
      >
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {group.key}
          </p>
          <h3 className="text-sm font-semibold tracking-tight text-foreground">
            {groupLabel}
          </h3>
          {groupDescription ? (
            <p className="max-w-3xl text-xs leading-5 text-muted-foreground">
              {groupDescription}
            </p>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="rounded-full border border-border/50 bg-surface-subtle/35 px-3 py-1 text-xs text-muted-foreground">
            {groupCountLabel(group.permissions.length)}
          </span>
          <span className="rounded-full border border-border/50 bg-surface-subtle/35 p-2 text-muted-foreground">
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                isMobileBodyVisible ? "rotate-180" : "rotate-0",
              )}
            />
          </span>
        </div>
      </button>

      <div className="hidden flex-col gap-3 px-4 py-4 md:px-5 sm:flex md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {group.key}
          </p>
          <h3 className="text-sm font-semibold tracking-tight text-foreground">
            {groupLabel}
          </h3>
          {groupDescription ? (
            <p className="max-w-3xl text-xs leading-5 text-muted-foreground">
              {groupDescription}
            </p>
          ) : null}
        </div>
        <span className="rounded-full border border-border/50 bg-surface-subtle/35 px-3 py-1 text-xs text-muted-foreground">
          {groupCountLabel(group.permissions.length)}
        </span>
      </div>

      {group.permissions.length ? (
        <div
          className={cn(
            "space-y-3 border-t border-border/50 px-3 py-3 md:px-4 md:py-4 sm:block",
            isMobileBodyVisible ? "block" : "hidden",
          )}
        >
          {group.permissions.map((permission) => (
            <PermissionRow
              key={permission.id}
              permission={permission}
              getPermissionText={getPermissionText}
            />
          ))}
        </div>
      ) : (
        <div
          className={cn(
            "mx-3 mb-3 rounded-lg border border-border/50 bg-surface-subtle/30 px-4 py-4 text-sm text-muted-foreground md:mx-4 md:mb-4 sm:block",
            isMobileBodyVisible ? "block" : "hidden",
          )}
        >
          {emptyPermissionsLabel}
        </div>
      )}
    </section>
  );
}
