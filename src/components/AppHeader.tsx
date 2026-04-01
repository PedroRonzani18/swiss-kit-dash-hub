import { SidebarTrigger } from "@/components/ui/sidebar";
import { Search } from "lucide-react";

interface AppHeaderProps {
  breadcrumbs?: string[];
  onOpenCommand?: () => void;
}

export function AppHeader({ breadcrumbs = ["App", "Financeiro"] }: AppHeaderProps) {
  const triggerCommand = () => {
    const e = new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true });
    document.dispatchEvent(e);
  };

  return (
    <header className="h-14 flex items-center justify-between border-b border-border px-4 shrink-0">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
        <nav className="flex items-center gap-1 text-sm text-muted-foreground">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <span className="text-border">/</span>}
              <span className={i === breadcrumbs.length - 1 ? "text-foreground font-medium" : ""}>
                {crumb}
              </span>
            </span>
          ))}
        </nav>
      </div>
      <button
        onClick={triggerCommand}
        className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary hover:bg-muted px-3 py-1.5 rounded-md transition-colors"
      >
        <Search className="h-3 w-3" />
        <span>Buscar</span>
        <kbd className="ml-1 font-mono-code text-[10px] bg-muted px-1.5 py-0.5 rounded">⌘K</kbd>
      </button>
    </header>
  );
}
