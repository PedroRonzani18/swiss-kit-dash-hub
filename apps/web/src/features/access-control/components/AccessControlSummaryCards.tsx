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
        <Card key={item.label}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {item.label}
            </CardTitle>
            <item.icon className="h-4 w-4 text-brand-strong" />
          </CardHeader>
          <CardContent>
            <p className="font-display text-3xl font-semibold text-foreground">
              {item.value}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
