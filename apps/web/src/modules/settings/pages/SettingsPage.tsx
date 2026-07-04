import { AppLayout } from "@/components/AppLayout";
import { useSettingsOverview } from "@/features/settings";

export function SettingsPage() {
  const settingsOverviewQuery = useSettingsOverview();

  return (
    <AppLayout breadcrumbs={["SwissKit", "Settings"]}>
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <div className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Template module
          </p>
          <div className="space-y-2">
            <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              Settings
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
              Modulo neutro para validar o padrao de paginas roteaveis do
              Swiss Kit sem acoplar regras de produto ao Core.
            </p>
          </div>
        </div>

        {settingsOverviewQuery.isLoading ? (
          <div className="rounded-2xl border border-border/70 bg-card/70 p-5 text-sm text-muted-foreground shadow-sm">
            Carregando configuracoes...
          </div>
        ) : null}

        {settingsOverviewQuery.isError ? (
          <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-5 text-sm text-destructive shadow-sm">
            Nao foi possivel carregar as configuracoes do template.
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
                  {section.label}
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {section.description}
                </p>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </AppLayout>
  );
}
