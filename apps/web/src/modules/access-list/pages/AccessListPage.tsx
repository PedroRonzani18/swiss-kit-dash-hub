import { useQuery } from '@tanstack/react-query';
import { getAllowedEmailsOverview } from '@/api/allowed-emails';
import { AppLayout } from '@/components/AppLayout';

export function AccessListPage() {
  const overviewQuery = useQuery({
    queryKey: ['entry-list', 'overview'] as const,
    queryFn: getAllowedEmailsOverview,
    staleTime: 60_000,
  });

  return (
    <AppLayout breadcrumbs={["SwissKit", "Allowed Emails"]}>
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <div className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Access baseline
          </p>
          <div className="space-y-2">
            <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              Allowed Emails
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
              Lista de emails liberados para acessar o template. Este PR e
              somente leitura e nao adiciona CRUD ou permissoes.
            </p>
          </div>
        </div>

        {overviewQuery.isLoading ? (
          <div className="rounded-2xl border border-border/70 bg-card/70 p-5 text-sm text-muted-foreground shadow-sm">
            Carregando emails...
          </div>
        ) : null}

        {overviewQuery.isError ? (
          <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-5 text-sm text-destructive shadow-sm">
            Nao foi possivel carregar a lista de emails.
          </div>
        ) : null}

        {overviewQuery.data ? (
          <div className="overflow-hidden rounded-2xl border border-border/70 bg-card/70 shadow-sm">
            <div className="border-b border-border/70 px-5 py-4">
              <h2 className="text-base font-semibold text-foreground">
                Emails cadastrados
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {overviewQuery.data.allowedEmails.length} email(s) encontrado(s).
              </p>
            </div>

            <div className="divide-y divide-border/70">
              {overviewQuery.data.allowedEmails.map((entry) => (
                <article key={entry.id} className="px-5 py-4">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-foreground">
                        {entry.email}
                      </h3>
                      {entry.note ? (
                        <p className="text-sm text-muted-foreground">
                          {entry.note}
                        </p>
                      ) : null}
                    </div>
                    <span className="text-xs uppercase tracking-wide text-muted-foreground">
                      {entry.isActive ? 'active' : 'inactive'}
                    </span>
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
