import type { PermissionActionContract } from "@swisskit/contracts/permissions";

import { Badge } from "@/components/ui/badge";

interface PermissionActionBadgeProps {
  action: PermissionActionContract | (string & {});
}

const actionVariantMap = {
  manage: "warning",
  read: "info",
  access: "success",
} as const;

export function PermissionActionBadge({
  action,
}: PermissionActionBadgeProps) {
  const variant =
    actionVariantMap[action as keyof typeof actionVariantMap] ?? "secondary";

  return <Badge variant={variant}>{action}</Badge>;
}
