import { AppLayout } from "@/components/AppLayout";
import { useAccessControlOverview } from "@/features/access-control/hooks/useAccessControlOverview";

export function AccessControlPage() {
  const query = useAccessControlOverview();

  return (
    <AppLayout breadcrumbs={["SwissKit", "Access Control"]}>
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
            Access Control
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Local permission catalog for the Swiss Kit template.
          </p>
        </div>

        {query.isLoading ? <p className="text-sm text-muted-foreground">Loading...</p> : null}
        {query.isError ? <p className="text-sm text-destructive">Failed to load.</p> : null}

        {query.data ? (
          <div className="rounded-2xl border border-border/70 bg-card/70 shadow-sm">
            {query.data.permissions.map((permission) => (
              <div key={permission.id} className="border-b border-border/70 px-5 py-4 last:border-b-0">
                <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                  <span className="text-sm font-medium text-foreground">
                    {permission.label}
                  </span>
                  <code className="text-xs text-muted-foreground">{permission.key}</code>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </section>
    </AppLayout>
  );
}
