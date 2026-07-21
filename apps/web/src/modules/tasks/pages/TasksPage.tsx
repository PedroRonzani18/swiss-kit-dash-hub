import { AppLayout } from '@/components/AppLayout';
import { useTasksOverview } from '@/features/tasks/hooks/useTasksOverview';
import { useTranslation } from 'react-i18next';

export function TasksPage() {
  const tasksOverviewQuery = useTasksOverview();
  const { t } = useTranslation();

  return (
    <AppLayout
      breadcrumbs={[t('common.brand'), t('navigation.modules.tasks.label')]}
    >
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <div className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            {t('tasks.eyebrow')}
          </p>
          <div className="space-y-2">
            <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              {t('tasks.title')}
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
              {t('tasks.description')}
            </p>
          </div>
        </div>

        {tasksOverviewQuery.isLoading ? (
          <p className="text-sm text-muted-foreground">{t('tasks.loading')}</p>
        ) : null}

        {tasksOverviewQuery.isError ? (
          <p className="text-sm text-destructive">{t('tasks.error')}</p>
        ) : null}

        {tasksOverviewQuery.data ? (
          tasksOverviewQuery.data.tasks.length === 0 ? (
            <div className="rounded-2xl border border-border/70 bg-card/70 p-5 text-sm text-muted-foreground shadow-sm">
              {t('tasks.empty')}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {tasksOverviewQuery.data.tasks.map((task) => (
                <article
                  key={task.id}
                  className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <h2 className="text-base font-semibold text-foreground">
                        {t(task.titleKey)}
                      </h2>
                      <p className="text-sm leading-6 text-muted-foreground">
                        {task.descriptionKey
                          ? t(task.descriptionKey)
                          : t('tasks.noDescription')}
                      </p>
                    </div>
                    <span className="rounded-full border border-border/70 px-2 py-1 text-xs text-muted-foreground">
                      {t(`common.status.${task.status}`)}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )
        ) : null}
      </section>
    </AppLayout>
  );
}
