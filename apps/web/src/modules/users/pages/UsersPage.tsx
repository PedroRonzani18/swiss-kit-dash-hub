import { useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/auth";
import { createOrReactivateUser, updateUserStatus } from "@/api/users";
import { usersKeys } from "@/api/queryKeys";
import { AppLayout } from "@/components/AppLayout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUsersOverview } from "@/features/users/hooks/useUsersOverview";
import { useTranslation } from "react-i18next";

export function UsersPage() {
  const usersOverviewQuery = useUsersOverview();
  const queryClient = useQueryClient();
  const { can } = useAuth();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [userPendingDeactivation, setUserPendingDeactivation] = useState<{
    id: string;
    label: string;
  } | null>(null);
  const canCreate = can("users:create");
  const canUpdate = can("users:update");

  const createMutation = useMutation({
    mutationFn: createOrReactivateUser,
    onSuccess: async () => {
      setEmail("");
      setNote("");
      await queryClient.invalidateQueries({ queryKey: usersKeys.overview() });
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      updateUserStatus(id, { isActive }),
    onSuccess: async () => {
      setUserPendingDeactivation(null);
      await queryClient.invalidateQueries({ queryKey: usersKeys.overview() });
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    createMutation.mutate({ email, note: note || null });
  }

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

        {canCreate ? (
          <form
            className="grid gap-3 rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm md:grid-cols-[1fr_1fr_auto]"
            onSubmit={handleSubmit}
          >
            <Input
              onChange={(event) => setEmail(event.target.value)}
              placeholder={t("users.emailPlaceholder")}
              required
              type="email"
              value={email}
            />
            <Input
              onChange={(event) => setNote(event.target.value)}
              placeholder={t("users.notePlaceholder")}
              type="text"
              value={note}
            />
            <Button
              disabled={createMutation.isPending}
              type="submit"
            >
              {createMutation.isPending ? t("users.saving") : t("users.add")}
            </Button>
          </form>
        ) : null}

        {createMutation.isError ? (
          <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-5 text-sm text-destructive shadow-sm">
            {t("users.saveError")}
          </div>
        ) : null}

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
              {usersOverviewQuery.data.users.length === 0 ? (
                <p className="px-5 py-8 text-sm text-muted-foreground">
                  {t("users.empty")}
                </p>
              ) : usersOverviewQuery.data.users.map((user) => (
                <article key={user.id} className="px-5 py-4">
                  <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-foreground">
                        {user.name ?? user.email}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                      {user.note ? (
                        <p className="text-sm text-muted-foreground">{user.note}</p>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs uppercase tracking-wide text-muted-foreground">
                        {user.isActive
                          ? t("common.status.active")
                          : t("common.status.inactive")}
                      </span>
                      <span className="text-xs uppercase tracking-wide text-muted-foreground">
                        {user.provider
                          ? t(`common.providers.${user.provider}`, {
                              defaultValue: user.provider,
                            })
                          : t("users.pending")}
                      </span>
                      {canUpdate ? (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={statusMutation.isPending}
                          onClick={() => {
                            if (!user.isActive) {
                              statusMutation.mutate({
                                id: user.id,
                                isActive: true,
                              });
                              return;
                            }

                            setUserPendingDeactivation({
                              id: user.id,
                              label: user.name ?? user.email,
                            });
                          }}
                          type="button"
                        >
                          {user.isActive ? t("users.deactivate") : t("users.activate")}
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      <AlertDialog
        open={Boolean(userPendingDeactivation)}
        onOpenChange={(open) => {
          if (!open && !statusMutation.isPending) {
            setUserPendingDeactivation(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("users.deactivateDialog.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("users.deactivateDialog.description", {
                user: userPendingDeactivation?.label,
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={statusMutation.isPending}>
              {t("common.actions.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={statusMutation.isPending}
              onClick={(event) => {
                event.preventDefault();
                if (userPendingDeactivation) {
                  statusMutation.mutate({
                    id: userPendingDeactivation.id,
                    isActive: false,
                  });
                }
              }}
            >
              {statusMutation.isPending
                ? t("users.saving")
                : t("users.deactivateDialog.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
