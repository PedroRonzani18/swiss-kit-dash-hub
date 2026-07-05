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
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Card
          key={item.label}
          className="border-border/60 bg-card shadow-business-sm"
        >
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
            <CardTitle className="max-w-[12rem] text-sm font-medium leading-5 text-muted-foreground">
              {item.label}
            </CardTitle>
            <div className="rounded-full border border-border/60 bg-surface-subtle/65 p-2">
              <item.icon className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="font-display text-4xl font-semibold tracking-tight text-foreground">
              {item.value}
            </p>
            <p className="mt-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">
              {item.label}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
