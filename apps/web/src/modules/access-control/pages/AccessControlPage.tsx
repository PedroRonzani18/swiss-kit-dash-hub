import { AppLayout } from "@/components/AppLayout";
import { useAccessControlOverview } from "@/features/access-control/hooks/useAccessControlOverview";

export function AccessControlPage() {
  const query = useAccessControlOverview();

  return (
    <AppLayout breadcrumbs={["SwissKit", "Access Control"]}>
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
            Access Control
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Local roles and permission catalog for the Swiss Kit template.
          </p>
        </div>

        {query.isLoading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : null}
        {query.isError ? (
          <p className="text-sm text-destructive">Failed to load.</p>
        ) : null}

        {query.data ? (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.8fr)]">
            <section className="rounded-2xl border border-border/70 bg-card/70 shadow-sm">
              <div className="border-b border-border/70 px-5 py-4">
                <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-foreground">
                      Permissions
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Persisted permission catalog used by guards and modules.
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {query.data.permissions.length} permissions
                  </span>
                </div>
              </div>

              {query.data.permissions.map((permission) => (
                <div
                  key={permission.id}
                  className="border-b border-border/70 px-5 py-4 last:border-b-0"
                >
                  <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                    <span className="text-sm font-medium text-foreground">
                      {permission.label}
                    </span>
                    <code className="text-xs text-muted-foreground">
                      {permission.key}
                    </code>
                  </div>
                  {permission.description ? (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {permission.description}
                    </p>
                  ) : null}
                </div>
              ))}
            </section>

            <section className="rounded-2xl border border-border/70 bg-card/70 shadow-sm">
              <div className="border-b border-border/70 px-5 py-4">
                <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-foreground">
                      Roles
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Persisted roles and their assigned permissions.
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {query.data.roles.length} roles
                  </span>
                </div>
              </div>

              {query.data.roles.length ? (
                query.data.roles.map((role) => (
                  <article
                    key={role.id}
                    className="border-b border-border/70 px-5 py-4 last:border-b-0"
                  >
                    <div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">
                          {role.label}
                        </h3>
                        {role.description ? (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {role.description}
                          </p>
                        ) : null}
                      </div>
                      <code className="text-xs text-muted-foreground">
                        {role.key}
                      </code>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {role.permissions.length ? (
                        role.permissions.map((permission) => (
                          <code
                            key={permission.id}
                            className="rounded-full border border-border/70 px-2 py-1 text-[11px] text-muted-foreground"
                          >
                            {permission.key}
                          </code>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          No permissions assigned.
                        </span>
                      )}
                    </div>
                  </article>
                ))
              ) : (
                <div className="px-5 py-4 text-sm text-muted-foreground">
                  No roles found. Run the Prisma seed to create the baseline roles.
                </div>
              )}
            </section>
          </div>
        ) : null}
      </section>
    </AppLayout>
  );
}
