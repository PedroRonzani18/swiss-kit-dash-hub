import type { AccessControlOverviewContract } from "@swisskit/contracts/access-control";
import { useState } from "react";

import { SectionCard } from "@/components/SectionCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
  filteredRolesLabel: string;
  noPermissionsLabel: string;
  permissionCountLabel: (count: number) => string;
  expandLabel: string;
  collapseLabel: string;
  rolesSearchLabel: string;
  rolesSearchPlaceholder: string;
  clearFiltersLabel: string;
  searchFilterLabel: (value: string) => string;
  emptyFilteredRolesTitle: string;
  emptyFilteredRolesDescription: string;
  openFiltersLabel: string;
  mobileFiltersTitle: string;
  mobileFiltersDescription: string;
}

export function RoleCatalogPanel({
  data,
  getRoleText,
  rolesTitle,
  rolesDescription,
  rolesCountLabel,
  noRolesLabel,
  filteredRolesLabel,
  noPermissionsLabel,
  permissionCountLabel,
  expandLabel,
  collapseLabel,
  rolesSearchLabel,
  rolesSearchPlaceholder,
  clearFiltersLabel,
  searchFilterLabel,
  emptyFilteredRolesTitle,
  emptyFilteredRolesDescription,
  openFiltersLabel,
  mobileFiltersTitle,
  mobileFiltersDescription,
}: RoleCatalogPanelProps) {
  const [search, setSearch] = useState("");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const roles = filterRolesForDisplay(data.roles, {
    search,
    resolveRoleText: (role) => ({
      label: getRoleText(role.key, "label", role.label),
      description: getRoleText(role.key, "description", role.description ?? ""),
    }),
  });
  const hasActiveFilters = search.trim().length > 0;
  const activeSearch = search.trim();
  const resetFilters = () => setSearch("");
  const filterControls = (
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
  );

  return (
    <SectionCard
      title={rolesTitle}
      description={rolesDescription}
      className="border-0 bg-transparent shadow-none"
      headerClassName="gap-4 border-b border-border/50 px-0 pb-5"
      contentClassName="px-0 pt-5"
      action={
        <span className="rounded-full border border-border/50 bg-surface-subtle/45 px-3 py-1 text-xs text-muted-foreground">
          {rolesCountLabel(roles.length)}
        </span>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3 md:hidden">
          <Sheet
            open={isMobileFiltersOpen}
            onOpenChange={setIsMobileFiltersOpen}
          >
            <SheetTrigger asChild>
              <Button type="button" variant="outline" size="sm">
                {openFiltersLabel}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-2xl px-4 pb-6">
              <SheetHeader>
                <SheetTitle>{mobileFiltersTitle}</SheetTitle>
                <SheetDescription>{mobileFiltersDescription}</SheetDescription>
              </SheetHeader>
              <div className="mt-4">{filterControls}</div>
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-border/50 bg-surface-subtle/45 px-3 py-1 text-xs text-muted-foreground">
              {rolesCountLabel(roles.length)}
            </span>
            {hasActiveFilters ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={resetFilters}
              >
                {clearFiltersLabel}
              </Button>
            ) : null}
          </div>
        </div>

        <div className="hidden flex-col gap-3 md:flex md:flex-row md:items-end">
          {filterControls}
          {hasActiveFilters ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={resetFilters}
            >
              {clearFiltersLabel}
            </Button>
          ) : null}
        </div>

        {hasActiveFilters ? (
          <div className="rounded-xl border border-border/60 bg-surface-subtle/35 px-4 py-3">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {filteredRolesLabel}
                </p>
                <span className="inline-flex rounded-full border border-border/50 bg-card px-2.5 py-1 text-xs text-foreground">
                  {searchFilterLabel(activeSearch)}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {rolesCountLabel(roles.length)}
              </span>
            </div>
          </div>
        ) : null}

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
        ) : hasActiveFilters ? (
          <div className="rounded-xl border border-border/60 bg-surface-subtle/25 px-5 py-6">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground">
                {emptyFilteredRolesTitle}
              </p>
              <p className="text-sm text-muted-foreground">
                {emptyFilteredRolesDescription}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{noRolesLabel}</p>
        )}
      </div>
    </SectionCard>
  );
}
