import { SidebarTrigger } from "@/components/ui/sidebar";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/auth";
import { toast } from "sonner";

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
      <div className="flex items-center gap-2">
        <button
          onClick={triggerCommand}
          className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary hover:bg-muted px-3 py-1.5 rounded-md transition-colors"
        >
          <Search className="h-3 w-3" />
          <span>Buscar</span>
          <kbd className="ml-1 font-mono-code text-[10px] bg-muted px-1.5 py-0.5 rounded">
            ⌘K
          </kbd>
        </button>

        {isAuthenticated ? (
          <>
            <span className="hidden md:inline text-xs text-muted-foreground max-w-48 truncate">
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
