import type { AccessControlOverviewContract } from "@swisskit/contracts/access-control";
import { useState } from "react";

import type { PermissionActionContract } from "@swisskit/contracts/permissions";

import { SectionCard } from "@/components/SectionCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  filterPermissionGroupsForDisplay,
  type PermissionActionFilterValue,
} from "../lib/access-control-view-model";
import { PermissionGroupCard } from "./PermissionGroupCard";

interface PermissionCatalogPanelProps {
  data: AccessControlOverviewContract;
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
  permissionsTitle: string;
  permissionsDescription: string;
  permissionsCountLabel: (count: number) => string;
  emptyGroupsLabel: string;
  emptyPermissionsLabel: string;
  noPermissionResultsLabel: string;
  groupCountLabel: (count: number) => string;
  permissionsSearchLabel: string;
  permissionsSearchPlaceholder: string;
  actionLabel: string;
  allActionsLabel: string;
  clearFiltersLabel: string;
  actionOptionLabel: (action: PermissionActionContract) => string;
}

export function PermissionCatalogPanel({
  data,
  getGroupText,
  getPermissionText,
  permissionsTitle,
  permissionsDescription,
  permissionsCountLabel,
  emptyGroupsLabel,
  emptyPermissionsLabel,
  noPermissionResultsLabel,
  groupCountLabel,
  permissionsSearchLabel,
  permissionsSearchPlaceholder,
  actionLabel,
  allActionsLabel,
  clearFiltersLabel,
  actionOptionLabel,
}: PermissionCatalogPanelProps) {
  const [search, setSearch] = useState("");
  const [action, setAction] = useState<PermissionActionFilterValue>("all");

  const filteredGroups = filterPermissionGroupsForDisplay(
    data.permissionGroups,
    {
      search,
      action,
      resolveGroupText: (group) => ({
        label: getGroupText(group.key, "label", group.label),
        description: getGroupText(
          group.key,
          "description",
          group.description ?? "",
        ),
      }),
      resolvePermissionText: (permission) => ({
        label: getPermissionText(permission.key, "label", permission.label),
        description: getPermissionText(
          permission.key,
          "description",
          permission.description ?? "",
        ),
      }),
    },
  );
  const hasActiveFilters = search.trim().length > 0 || action !== "all";
  const visiblePermissionsCount = filteredGroups.reduce(
    (count, group) => count + group.permissions.length,
    0,
  );

  return (
    <SectionCard
      title={permissionsTitle}
      description={permissionsDescription}
      action={
        <span className="text-xs text-muted-foreground">
          {permissionsCountLabel(visiblePermissionsCount)}
        </span>
      }
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-end">
          <div className="flex-1 space-y-2">
            <p className="text-xs font-medium text-muted-foreground">
              {permissionsSearchLabel}
            </p>
            <Input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={permissionsSearchPlaceholder}
            />
          </div>
          <div className="w-full space-y-2 md:w-52">
            <p className="text-xs font-medium text-muted-foreground">
              {actionLabel}
            </p>
            <Select
              value={action}
              onValueChange={(value) =>
                setAction(value as PermissionActionFilterValue)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={allActionsLabel} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{allActionsLabel}</SelectItem>
                <SelectItem value="access">
                  {actionOptionLabel("access")}
                </SelectItem>
                <SelectItem value="read">{actionOptionLabel("read")}</SelectItem>
                <SelectItem value="create">
                  {actionOptionLabel("create")}
                </SelectItem>
                <SelectItem value="update">
                  {actionOptionLabel("update")}
                </SelectItem>
                <SelectItem value="delete">
                  {actionOptionLabel("delete")}
                </SelectItem>
                <SelectItem value="manage">
                  {actionOptionLabel("manage")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          {hasActiveFilters ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearch("");
                setAction("all");
              }}
            >
              {clearFiltersLabel}
            </Button>
          ) : null}
        </div>

        {filteredGroups.length ? (
          <div className="space-y-4">
            {filteredGroups.map((group) => (
              <PermissionGroupCard
                key={group.id}
                group={group}
                getGroupText={getGroupText}
                getPermissionText={getPermissionText}
                emptyPermissionsLabel={emptyPermissionsLabel}
                groupCountLabel={groupCountLabel}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {hasActiveFilters ? noPermissionResultsLabel : emptyGroupsLabel}
          </p>
        )}
      </div>
    </SectionCard>
  );
}
