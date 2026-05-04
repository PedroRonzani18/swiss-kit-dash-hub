import { useEffect } from "react";
import { useAuth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers } from "lucide-react";
import { toast } from "@/components/ui/sonner";

export function LoginPage() {
  const { isLoading, loginWithGoogle } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authError = params.get("authError");

    if (!authError) {
      return;
    }

    toast.error("Falha ao autenticar com Google");

    params.delete("authError");
    const nextSearch = params.toString();
    const nextUrl = `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ""}${window.location.hash}`;
    window.history.replaceState({}, "", nextUrl);
  }, []);

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível autenticar com Google";
      toast.error(message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-app-grid px-4">
      <Card className="w-full max-w-md border-border/70 bg-surface-panel/95 shadow-business-lg">
        <CardHeader className="space-y-4">
          <div className="flex items-center gap-2 text-brand">
            <Layers className="h-6 w-6" />
            <span className="font-display text-lg font-semibold tracking-tight text-foreground">
              SwissKit
            </span>
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl">Entrar no sistema</CardTitle>
            <CardDescription>
              Faça login com Google para acessar seu dashboard financeiro.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Button onClick={handleLogin} disabled={isLoading} className="w-full">
            {isLoading ? "Redirecionando..." : "Entrar com Google"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
