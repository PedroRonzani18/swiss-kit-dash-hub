import { AppLayout } from '@/components/AppLayout';
import { useAccessControlOverview } from '@/features/access-control/hooks/useAccessControlOverview';
import { useTranslation } from 'react-i18next';

export function AccessControlPage() {
  const query = useAccessControlOverview();
  const { t } = useTranslation();

  const getPermissionText = (
    key: string,
    field: 'label' | 'description',
    fallback: string,
  ) =>
    t(`accessControl.catalog.permissions.${key.replace(':', '.')}.${field}`, {
      defaultValue: fallback,
    });

  const getRoleText = (
    key: string,
    field: 'label' | 'description',
    fallback: string,
  ) =>
    t(`accessControl.catalog.roles.${key}.${field}`, {
      defaultValue: fallback,
    });

  const getGroupText = (
    key: string,
    field: 'label' | 'description',
    fallback: string,
  ) =>
    t(`accessControl.catalog.groups.${key}.${field}`, {
      defaultValue: fallback,
    });

  return (
    <AppLayout
      breadcrumbs={[
        t('common.brand'),
        t('navigation.modules.accessControl.label'),
      ]}
    >
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
            {t('accessControl.title')}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t('accessControl.description')}
          </p>
        </div>

        {query.isLoading ? (
          <p className="text-sm text-muted-foreground">
            {t('accessControl.loading')}
          </p>
        ) : null}
        {query.isError ? (
          <p className="text-sm text-destructive">{t('accessControl.error')}</p>
        ) : null}

        {query.data ? (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.8fr)]">
            <section className="rounded-lg border border-border/70 bg-card/70 shadow-sm">
              <div className="border-b border-border/70 px-5 py-4">
                <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-foreground">
                      {t('accessControl.permissions')}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {t('accessControl.permissionsDescription')}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {t('accessControl.permissionsCount', {
                      count: query.data.permissions.length,
                    })}
                  </span>
                </div>
              </div>

              {query.data.permissionGroups.map((group) => (
                <div
                  key={group.id}
                  className="border-b border-border/70 last:border-b-0"
                >
                  <div className="px-5 py-4">
                    <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">
                          {getGroupText(group.key, 'label', group.label)}
                        </h3>
                        {group.description ? (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {getGroupText(
                              group.key,
                              'description',
                              group.description,
                            )}
                          </p>
                        ) : null}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {t('accessControl.groupCount', {
                          count: group.permissions.length,
                        })}
                      </span>
                    </div>
                  </div>

                  {group.permissions.length ? (
                    group.permissions.map((permission) => (
                      <div
                        key={permission.id}
                        className="border-t border-border/70 px-5 py-4"
                      >
                        <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                          <span className="text-sm font-medium text-foreground">
                            {getPermissionText(
                              permission.key,
                              'label',
                              permission.label,
                            )}
                          </span>
                          <code className="text-xs text-muted-foreground">
                            {permission.key}
                          </code>
                        </div>
                        {permission.description ? (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {getPermissionText(
                              permission.key,
                              'description',
                              permission.description,
                            )}
                          </p>
                        ) : null}
                      </div>
                    ))
                  ) : (
                    <div className="border-t border-border/70 px-5 py-4 text-sm text-muted-foreground">
                      {t('accessControl.noPermissions')}
                    </div>
                  )}
                </div>
              ))}
            </section>

            <section className="rounded-lg border border-border/70 bg-card/70 shadow-sm">
              <div className="border-b border-border/70 px-5 py-4">
                <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-foreground">
                      {t('accessControl.roles')}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {t('accessControl.rolesDescription')}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {t('accessControl.rolesCount', {
                      count: query.data.roles.length,
                    })}
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
                          {getRoleText(role.key, 'label', role.label)}
                        </h3>
                        {role.description ? (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {getRoleText(
                              role.key,
                              'description',
                              role.description,
                            )}
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
                          {t('accessControl.noPermissions')}
                        </span>
                      )}
                    </div>
                  </article>
                ))
              ) : (
                <div className="px-5 py-4 text-sm text-muted-foreground">
                  {t('accessControl.noRoles')}
                </div>
              )}
            </section>
          </div>
        ) : null}
      </section>
    </AppLayout>
  );
}
