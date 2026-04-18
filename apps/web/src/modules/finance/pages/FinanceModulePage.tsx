import { useEffect } from "react";
import { useAuth } from "@/auth";
import { AppLayout } from "@/components/AppLayout";
import {
  FinanceDataPrefetcher,
  FinanceDashboardPage,
  FinanceLoadingState,
  UnauthenticatedFinanceState,
} from "@/features/finance";
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

  let content: JSX.Element;

  if (isAuthLoading && !isAuthenticated) {
    content = (
      <AppLayout breadcrumbs={["SwissKit", "Financeiro"]}>
        <FinanceLoadingState />
      </AppLayout>
    );
  } else if (!isAuthenticated) {
    content = (
      <UnauthenticatedFinanceState
        isAuthLoading={isAuthLoading}
        onLogin={handleLogin}
      />
    );
  } else {
    content = <FinanceDashboardPage />;
  }

  return (
    <>
      <FinanceDataPrefetcher />
      {content}
    </>
  );
}
