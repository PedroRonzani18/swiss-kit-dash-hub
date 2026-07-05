import type { AccessControlOverviewContract } from "@swisskit/contracts/access-control";
import { useState } from "react";

import { SectionCard } from "@/components/SectionCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { filterRolesForDisplay } from "../lib/access-control-view-model";
import { RoleCard } from "./RoleCard";

interface RoleCatalogPanelProps {
  data: AccessControlOverviewContract;
  getRoleText: (
    key: string,
    field: "label" | "description",
    fallback: string,
  ) => string;
  rolesTitle: string;
  rolesDescription: string;
  rolesCountLabel: (count: number) => string;
  noRolesLabel: string;
  noRoleResultsLabel: string;
  noPermissionsLabel: string;
  permissionCountLabel: (count: number) => string;
  expandLabel: string;
  collapseLabel: string;
  rolesSearchLabel: string;
  rolesSearchPlaceholder: string;
  clearFiltersLabel: string;
}

export function RoleCatalogPanel({
  data,
  getRoleText,
  rolesTitle,
  rolesDescription,
  rolesCountLabel,
  noRolesLabel,
  noRoleResultsLabel,
  noPermissionsLabel,
  permissionCountLabel,
  expandLabel,
  collapseLabel,
  rolesSearchLabel,
  rolesSearchPlaceholder,
  clearFiltersLabel,
}: RoleCatalogPanelProps) {
  const [search, setSearch] = useState("");
  const roles = filterRolesForDisplay(data.roles, {
    search,
    resolveRoleText: (role) => ({
      label: getRoleText(role.key, "label", role.label),
      description: getRoleText(role.key, "description", role.description ?? ""),
    }),
  });
  const hasActiveFilters = search.trim().length > 0;

  return (
    <SectionCard
      title={rolesTitle}
      description={rolesDescription}
      action={
        <span className="text-xs text-muted-foreground">
          {rolesCountLabel(roles.length)}
        </span>
      }
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-end">
          <div className="flex-1 space-y-2">
            <p className="text-xs font-medium text-muted-foreground">
              {rolesSearchLabel}
            </p>
            <Input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={rolesSearchPlaceholder}
            />
          </div>
          {hasActiveFilters ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setSearch("")}
            >
              {clearFiltersLabel}
            </Button>
          ) : null}
        </div>

        {roles.length ? (
          <div className="space-y-4">
            {roles.map((role) => (
              <RoleCard
                key={role.id}
                role={role}
                getRoleText={getRoleText}
                permissionCountLabel={permissionCountLabel(
                  role.permissions.length,
                )}
                noPermissionsLabel={noPermissionsLabel}
                expandLabel={expandLabel}
                collapseLabel={collapseLabel}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {hasActiveFilters ? noRoleResultsLabel : noRolesLabel}
          </p>
        )}
      </div>
    </SectionCard>
  );
}
