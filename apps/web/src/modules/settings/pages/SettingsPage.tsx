import { AppLayout } from "@/components/AppLayout";
import { useSettingsOverview } from "@/features/settings";
import { useTranslation } from "react-i18next";

export function SettingsPage() {
  const settingsOverviewQuery = useSettingsOverview();
  const { t } = useTranslation();

  return (
    <AppLayout
      breadcrumbs={[
        t("common.brand"),
        t("navigation.modules.settings.label"),
      ]}
    >
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <div className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            {t("settings.eyebrow")}
          </p>
          <div className="space-y-2">
            <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              {t("settings.title")}
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
              {t("settings.description")}
            </p>
          </div>
        </div>

        {settingsOverviewQuery.isLoading ? (
          <div className="rounded-2xl border border-border/70 bg-card/70 p-5 text-sm text-muted-foreground shadow-sm">
            {t("settings.loading")}
          </div>
        ) : null}

        {settingsOverviewQuery.isError ? (
          <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-5 text-sm text-destructive shadow-sm">
            {t("settings.error")}
          </div>
        ) : null}

        {settingsOverviewQuery.data ? (
          <div className="grid gap-4 md:grid-cols-3">
            {settingsOverviewQuery.data.sections.map((section) => (
              <article
                key={section.id}
                className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm"
              >
                <h2 className="text-base font-semibold text-foreground">
                  {t(section.labelKey)}
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {t(section.descriptionKey)}
                </p>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </AppLayout>
  );
}
