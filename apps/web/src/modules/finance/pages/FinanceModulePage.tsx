import { useEffect } from "react";
import { useAuth } from "@/auth";
import { AppLayout } from "@/components/AppLayout";
import { FinanceModuleContent } from "@/features/finance";
import { toast } from "@/components/ui/sonner";

export function FinanceModulePage() {
  const { isAuthenticated, isLoading: isAuthLoading, loginWithGoogle } = useAuth();

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
      toast.success("Login realizado com sucesso");
    } catch (errorLogin) {
      const message =
        errorLogin instanceof Error ? errorLogin.message : "Falha ao autenticar com Google";
      toast.error(message);
    }
  };

  return (
    <AppLayout breadcrumbs={["SwissKit", "Financeiro"]}>
      <FinanceModuleContent
        isAuthenticated={isAuthenticated}
        isAuthLoading={isAuthLoading}
        onLogin={handleLogin}
      />
    </AppLayout>
  );
}
