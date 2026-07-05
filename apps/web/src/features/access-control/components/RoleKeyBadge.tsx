import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RoleKeyBadgeProps {
  roleKey: string;
  className?: string;
}

export function RoleKeyBadge({ roleKey, className }: RoleKeyBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "border-border/45 bg-surface-subtle/30 px-2 py-0.5 font-mono-code text-[10px] font-medium text-muted-foreground",
        className,
      )}
    >
      {roleKey}
    </Badge>
  );
}
