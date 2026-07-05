import type { AccessControlOverviewContract } from "@swisskit/contracts/access-control";

import { SectionCard } from "@/components/SectionCard";
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
  permissionsCountLabel: string;
  emptyGroupsLabel: string;
  emptyPermissionsLabel: string;
  groupCountLabel: (count: number) => string;
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
  groupCountLabel,
}: PermissionCatalogPanelProps) {
  return (
    <SectionCard
      title={permissionsTitle}
      description={permissionsDescription}
      action={
        <span className="text-xs text-muted-foreground">
          {permissionsCountLabel}
        </span>
      }
    >
      {data.permissionGroups.length ? (
        <div className="space-y-4">
          {data.permissionGroups.map((group) => (
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
        <p className="text-sm text-muted-foreground">{emptyGroupsLabel}</p>
      )}
    </SectionCard>
  );
}
