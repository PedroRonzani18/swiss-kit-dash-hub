import { Switch } from "@/components/ui/switch";

type SettingToggleRowProps = {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

export function SettingToggleRow({
  label,
  description,
  checked,
  onCheckedChange,
}: SettingToggleRowProps) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border border-border/70 bg-surface-subtle p-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
