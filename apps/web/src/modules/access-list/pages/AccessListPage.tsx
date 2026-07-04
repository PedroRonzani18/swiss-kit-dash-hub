import { FormEvent, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addEntry,
  getAllowedEmailsOverview,
  setEntryStatus,
} from '@/api/allowed-emails';
import { AppLayout } from '@/components/AppLayout';

const ACCESS_LIST_QUERY_KEY = ['entry-list', 'overview'] as const;

export function AccessListPage() {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');

  const overviewQuery = useQuery({
    queryKey: ACCESS_LIST_QUERY_KEY,
    queryFn: getAllowedEmailsOverview,
    staleTime: 60_000,
  });

  const createMutation = useMutation({
    mutationFn: addEntry,
    onSuccess: async () => {
      setEmail('');
      setNote('');
      await queryClient.invalidateQueries({ queryKey: ACCESS_LIST_QUERY_KEY });
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      setEntryStatus(id, { isActive }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ACCESS_LIST_QUERY_KEY });
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    createMutation.mutate({
      email,
      note: note || null,
    });
  }

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
              Lista de emails liberados para acessar o template. Agora com
              cadastro e ativacao/desativacao basicos, sem RBAC completo.
            </p>
          </div>
        </div>

        <form
          className="grid gap-3 rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm md:grid-cols-[1fr_1fr_auto]"
          onSubmit={handleSubmit}
        >
          <input
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="user@example.com"
            required
            type="email"
            value={email}
          />
          <input
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
            onChange={(event) => setNote(event.target.value)}
            placeholder="Observacao opcional"
            type="text"
            value={note}
          />
          <button
            className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
            disabled={createMutation.isPending}
            type="submit"
          >
            {createMutation.isPending ? 'Salvando...' : 'Adicionar'}
          </button>
        </form>

        {createMutation.isError ? (
          <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-5 text-sm text-destructive shadow-sm">
            Nao foi possivel salvar o email.
          </div>
        ) : null}

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
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
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
                    <div className="flex items-center gap-3">
                      <span className="text-xs uppercase tracking-wide text-muted-foreground">
                        {entry.isActive ? 'active' : 'inactive'}
                      </span>
                      <button
                        className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={statusMutation.isPending}
                        onClick={() =>
                          statusMutation.mutate({
                            id: entry.id,
                            isActive: !entry.isActive,
                          })
                        }
                        type="button"
                      >
                        {entry.isActive ? 'Desativar' : 'Ativar'}
                      </button>
                    </div>
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
