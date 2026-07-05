import { AppLayout } from "@/components/AppLayout";
import { useUsersOverview } from "@/features/users/hooks/useUsersOverview";
import { useTranslation } from "react-i18next";

export function UsersPage() {
  const usersOverviewQuery = useUsersOverview();
  const { t } = useTranslation();

  return (
    <AppLayout
      breadcrumbs={[
        t("common.brand"),
        t("navigation.modules.users.label"),
      ]}
    >
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <div className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            {t("users.eyebrow")}
          </p>
          <div className="space-y-2">
            <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              {t("users.title")}
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
              {t("users.description")}
            </p>
          </div>
        </div>

        {usersOverviewQuery.isLoading ? (
          <div className="rounded-2xl border border-border/70 bg-card/70 p-5 text-sm text-muted-foreground shadow-sm">
            {t("users.loading")}
          </div>
        ) : null}

        {usersOverviewQuery.isError ? (
          <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-5 text-sm text-destructive shadow-sm">
            {t("users.error")}
          </div>
        ) : null}

        {usersOverviewQuery.data ? (
          <div className="overflow-hidden rounded-2xl border border-border/70 bg-card/70 shadow-sm">
            <div className="border-b border-border/70 px-5 py-4">
              <h2 className="text-base font-semibold text-foreground">
                {t("users.registered")}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("users.count", {
                  count: usersOverviewQuery.data.users.length,
                })}
              </p>
            </div>

            <div className="divide-y divide-border/70">
              {usersOverviewQuery.data.users.map((user) => (
                <article key={user.id} className="px-5 py-4">
                  <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-foreground">
                        {user.name ?? user.email}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      {t(`common.providers.${user.provider}`, {
                        defaultValue: user.provider,
                      })}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </AppLayout>
  );
}
