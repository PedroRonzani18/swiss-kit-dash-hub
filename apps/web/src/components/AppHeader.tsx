import { SidebarTrigger } from "@/components/ui/sidebar";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/auth";
import { toast } from "@/components/ui/sonner";

interface AppHeaderProps {
  breadcrumbs?: string[];
  onOpenCommand?: () => void;
}

export function AppHeader({ breadcrumbs = ["App", "Financeiro"] }: AppHeaderProps) {
  const { user, isAuthenticated, isLoading, loginWithGoogle, logout } = useAuth();

  const triggerCommand = () => {
    const e = new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true });
    document.dispatchEvent(e);
  };

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
      toast.success("Login realizado com sucesso");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Não foi possível autenticar com Google";
      toast.error(message);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Sessão encerrada");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Não foi possível sair da sessão";
      toast.error(message);
    }
  };

  return (
    <header className="app-topbar flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border/70 px-4 md:px-5">
      <div className="flex min-w-0 items-center gap-3">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
        <nav className="flex items-center gap-1 truncate text-sm text-muted-foreground">
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
      <div className="flex shrink-0 items-center gap-2">
        <button
          onClick={triggerCommand}
          className="group flex items-center gap-2 rounded-md border border-border/80 bg-surface-subtle px-3 py-1.5 text-xs text-muted-foreground shadow-business-sm transition-colors hover:border-brand/35 hover:bg-brand-soft hover:text-foreground"
        >
          <Search className="h-3 w-3" />
          <span>Buscar</span>
          <kbd className="app-kbd ml-1 group-hover:border-brand/40 group-hover:bg-surface-panel">
            ⌘K
          </kbd>
        </button>

        {isAuthenticated ? (
          <>
            <span className="hidden max-w-48 truncate text-xs text-muted-foreground md:inline">
              {user?.email}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Sair
            </Button>
          </>
        ) : (
          <Button size="sm" onClick={handleLogin} disabled={isLoading}>
            {isLoading ? "Entrando..." : "Entrar com Google"}
          </Button>
        )}
      </div>
    </header>
  );
}
