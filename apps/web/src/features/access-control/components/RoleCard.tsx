import { useState } from "react";

import type { RoleContract } from "@swisskit/contracts/permissions";
import { ChevronDown, ChevronUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PermissionKeyBadge } from "./PermissionKeyBadge";
import { RoleKeyBadge } from "./RoleKeyBadge";

interface RoleCardProps {
  role: RoleContract;
  getRoleText: (
    key: string,
    field: "label" | "description",
    fallback: string,
  ) => string;
  permissionCountLabel: string;
  noPermissionsLabel: string;
  expandLabel: string;
  collapseLabel: string;
}

export function RoleCard({
  role,
  getRoleText,
  permissionCountLabel,
  noPermissionsLabel,
  expandLabel,
  collapseLabel,
}: RoleCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <article className="rounded-lg border border-border/70 bg-surface-subtle/35">
      <div className="flex flex-col gap-4 px-4 py-4 md:px-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">
                {getRoleText(role.key, "label", role.label)}
              </h3>
              <RoleKeyBadge roleKey={role.key} />
            </div>
            {role.description ? (
              <p className="text-xs text-muted-foreground">
                {getRoleText(role.key, "description", role.description)}
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {permissionCountLabel}
            </span>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setIsExpanded((value) => !value)}
              aria-expanded={isExpanded}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
              <span>{isExpanded ? collapseLabel : expandLabel}</span>
            </Button>
          </div>
        </div>

        {isExpanded ? (
          role.permissions.length ? (
            <div className="flex flex-wrap gap-2 border-t border-border/70 pt-4">
              {role.permissions.map((permission) => (
                <PermissionKeyBadge
                  key={permission.id}
                  permissionKey={permission.key}
                />
              ))}
            </div>
          ) : (
            <p className="border-t border-border/70 pt-4 text-sm text-muted-foreground">
              {noPermissionsLabel}
            </p>
          )
        ) : null}
      </div>
    </article>
  );
}
