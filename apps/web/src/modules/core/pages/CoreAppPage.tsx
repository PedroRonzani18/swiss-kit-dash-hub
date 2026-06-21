import { AppLayout } from "@/components/AppLayout";

export function CoreAppPage() {
  return (
    <AppLayout breadcrumbs={["SwissKit", "Core"]}>
      <section className="mx-auto flex min-h-[calc(100svh-11rem)] w-full max-w-4xl items-center">
        <div className="space-y-4">
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Swiss Kit Core
          </p>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Nenhum modulo de produto ativo
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
            A base do sistema esta preservada com autenticacao, sessao, shell
            web e tooling do monorepo prontos para evolucao modular.
          </p>
        </div>
      </section>
    </AppLayout>
  );
}
