import { AppLayout } from "@/components/AppLayout";
import { useTranslation } from "react-i18next";

export function CoreAppPage() {
  const { t } = useTranslation();

  return (
    <AppLayout
      breadcrumbs={[
        t("common.brand"),
        t("navigation.modules.core.label"),
      ]}
    >
      <section className="mx-auto flex min-h-[calc(100svh-11rem)] w-full max-w-4xl items-center">
        <div className="space-y-4">
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            {t("core.eyebrow")}
          </p>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {t("core.title")}
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
            {t("core.description")}
          </p>
        </div>
      </section>
    </AppLayout>
  );
}
