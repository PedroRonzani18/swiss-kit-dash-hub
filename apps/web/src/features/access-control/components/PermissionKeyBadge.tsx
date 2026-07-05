import type { PermissionKeyContract } from "@swisskit/contracts/permissions";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PermissionKeyBadgeProps {
  permissionKey: PermissionKeyContract;
  className?: string;
}

export function PermissionKeyBadge({
  permissionKey,
  className,
}: PermissionKeyBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn("font-mono-code text-[11px]", className)}
    >
      {permissionKey}
    </Badge>
  );
}
