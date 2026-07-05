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
      className={cn(
        "border border-border/45 bg-surface-subtle/35 px-2 py-0.5 font-mono-code text-[10px] font-medium text-muted-foreground",
        className,
      )}
    >
      {permissionKey}
    </Badge>
  );
}
