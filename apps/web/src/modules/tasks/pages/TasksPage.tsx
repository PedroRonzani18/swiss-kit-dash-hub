import { AppLayout } from '@/components/AppLayout';
import { useTasksOverview } from '@/features/tasks/hooks/useTasksOverview';

export function TasksPage() {
  const tasksOverviewQuery = useTasksOverview();

  return (
    <AppLayout breadcrumbs={['SwissKit', 'Tasks']}>
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <div className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Example module
          </p>
          <div className="space-y-2">
            <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              Tasks
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
              Reference module showing the template flow from shared contracts to API endpoint, web API client, hook, page and module registry.
            </p>
          </div>
        </div>

        {tasksOverviewQuery.isLoading ? (
          <p className="text-sm text-muted-foreground">Loading tasks...</p>
        ) : null}

        {tasksOverviewQuery.isError ? (
          <p className="text-sm text-destructive">Failed to load tasks.</p>
        ) : null}

        {tasksOverviewQuery.data ? (
          <div className="grid gap-4 md:grid-cols-2">
            {tasksOverviewQuery.data.tasks.map((task) => (
              <article
                key={task.id}
                className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <h2 className="text-base font-semibold text-foreground">
                      {task.title}
                    </h2>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {task.description ?? 'No description.'}
                    </p>
                  </div>
                  <span className="rounded-full border border-border/70 px-2 py-1 text-xs text-muted-foreground">
                    {task.status}
                  </span>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </AppLayout>
  );
}
