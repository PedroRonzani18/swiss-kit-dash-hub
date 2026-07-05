import type { AccessControlOverviewContract } from "@swisskit/contracts/access-control";
import { FolderTree, KeyRound, Shield, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAccessControlSummary } from "../lib/access-control-view-model";

interface AccessControlSummaryCardsProps {
  data: AccessControlOverviewContract;
  labels: {
    permissions: string;
    roles: string;
    groups: string;
    managePermissions: string;
  };
}

export function AccessControlSummaryCards({
  data,
  labels,
}: AccessControlSummaryCardsProps) {
  const summary = getAccessControlSummary(data);
  const items = [
    {
      label: labels.permissions,
      value: summary.permissionsCount,
      icon: KeyRound,
    },
    {
      label: labels.roles,
      value: summary.rolesCount,
      icon: Users,
    },
    {
      label: labels.groups,
      value: summary.groupsCount,
      icon: FolderTree,
    },
    {
      label: labels.managePermissions,
      value: summary.managePermissionsCount,
      icon: Shield,
    },
  ];

  return (
    <div
      className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 xl:grid-cols-4"
      data-testid="access-control-summary-cards"
    >
      {items.map((item) => (
        <Card
          key={item.label}
          className="min-w-[11rem] shrink-0 border-border/60 bg-card shadow-business-sm sm:min-w-0"
        >
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3 sm:pb-4">
            <CardTitle className="max-w-[10rem] text-sm font-medium leading-5 text-muted-foreground sm:max-w-[12rem]">
              {item.label}
            </CardTitle>
            <div className="rounded-full border border-border/60 bg-surface-subtle/65 p-1.5 sm:p-2">
              <item.icon className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {item.value}
            </p>
            <p className="mt-1.5 text-[11px] uppercase tracking-[0.14em] text-muted-foreground sm:mt-2 sm:text-xs">
              {item.label}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
