import { useEffect } from "react";
import { useAuth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/shared/i18n/LanguageSwitcher";

export function LoginPage() {
  const { isLoading, loginWithGoogle } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authError = params.get("authError");

    if (!authError) {
      return;
    }

    toast.error(t("auth.loginFailed"));

    params.delete("authError");
    const nextSearch = params.toString();
    const nextUrl = `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ""}${window.location.hash}`;
    window.history.replaceState({}, "", nextUrl);
  }, [t]);

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch {
      toast.error(t("auth.loginFailedFallback"));
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-app-grid px-4">
      <div className="absolute right-4 top-4">
        <LanguageSwitcher />
      </div>
      <Card className="w-full max-w-md border-border/70 bg-surface-panel/95 shadow-business-lg">
        <CardHeader className="space-y-4">
          <div className="flex items-center gap-2 text-brand">
            <Layers className="h-6 w-6" />
            <span className="font-display text-lg font-semibold tracking-tight text-foreground">
              SwissKit
            </span>
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl">{t("auth.title")}</CardTitle>
            <CardDescription>
              {t("auth.description")}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Button onClick={handleLogin} disabled={isLoading} className="w-full">
            {isLoading ? t("auth.redirecting") : t("auth.signInWithGoogle")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
