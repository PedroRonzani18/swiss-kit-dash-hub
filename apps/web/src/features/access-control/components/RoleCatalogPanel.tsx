import type { AccessControlOverviewContract } from "@swisskit/contracts/access-control";

import { SectionCard } from "@/components/SectionCard";
import { sortRolesForDisplay } from "../lib/access-control-view-model";
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
  rolesCountLabel: string;
  noRolesLabel: string;
  noPermissionsLabel: string;
  permissionCountLabel: (count: number) => string;
  expandLabel: string;
  collapseLabel: string;
}

export function RoleCatalogPanel({
  data,
  getRoleText,
  rolesTitle,
  rolesDescription,
  rolesCountLabel,
  noRolesLabel,
  noPermissionsLabel,
  permissionCountLabel,
  expandLabel,
  collapseLabel,
}: RoleCatalogPanelProps) {
  const roles = sortRolesForDisplay(data.roles);

  return (
    <SectionCard
      title={rolesTitle}
      description={rolesDescription}
      action={
        <span className="text-xs text-muted-foreground">{rolesCountLabel}</span>
      }
    >
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
        <p className="text-sm text-muted-foreground">{noRolesLabel}</p>
      )}
    </SectionCard>
  );
}
