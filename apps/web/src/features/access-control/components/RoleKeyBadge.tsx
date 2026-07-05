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
      className={cn("font-mono-code text-[11px]", className)}
    >
      {roleKey}
    </Badge>
  );
}
