import type { AccessControlOverviewContract } from "@swisskit/contracts/access-control";
import type { UseQueryResult } from "@tanstack/react-query";

import { ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

import { PageHeader } from "@/components/PageHeader";
import { SectionCard } from "@/components/SectionCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AccessControlSummaryCards } from "./AccessControlSummaryCards";
import { PermissionCatalogPanel } from "./PermissionCatalogPanel";
import { RoleCatalogPanel } from "./RoleCatalogPanel";

interface AccessControlOverviewContentProps {
  query: UseQueryResult<AccessControlOverviewContract>;
}

export function AccessControlOverviewContent({
  query,
}: AccessControlOverviewContentProps) {
  const { t } = useTranslation();

  const getPermissionText = (
    key: string,
    field: "label" | "description",
    fallback: string,
  ) =>
    t(`accessControl.catalog.permissions.${key.replace(":", ".")}.${field}`, {
      defaultValue: fallback,
    });

  const getRoleText = (
    key: string,
    field: "label" | "description",
    fallback: string,
  ) =>
    t(`accessControl.catalog.roles.${key}.${field}`, {
      defaultValue: fallback,
    });

  const getGroupText = (
    key: string,
    field: "label" | "description",
    fallback: string,
  ) =>
    t(`accessControl.catalog.groups.${key}.${field}`, {
      defaultValue: fallback,
    });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow={t("navigation.modules.accessControl.label")}
        icon={ShieldCheck}
        title={t("accessControl.title")}
        description={t("accessControl.description")}
      />

      {query.isLoading ? (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-32 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-12 w-64 rounded-lg" />
          <Skeleton className="h-96 rounded-xl" />
        </div>
      ) : null}

      {query.isError ? (
        <SectionCard title={t("accessControl.title")}>
          <p className="text-sm text-destructive">{t("accessControl.error")}</p>
        </SectionCard>
      ) : null}

      {query.data ? (
        <>
          <AccessControlSummaryCards
            data={query.data}
            labels={{
              permissions: t("accessControl.summary.permissions"),
              roles: t("accessControl.summary.roles"),
              groups: t("accessControl.summary.groups"),
              managePermissions: t("accessControl.summary.managePermissions"),
            }}
          />

          <Tabs defaultValue="permissions" className="space-y-4">
            <TabsList>
              <TabsTrigger value="permissions">
                {t("accessControl.tabs.permissions")}
              </TabsTrigger>
              <TabsTrigger value="roles">
                {t("accessControl.tabs.roles")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="permissions">
              <PermissionCatalogPanel
                data={query.data}
                getGroupText={getGroupText}
                getPermissionText={getPermissionText}
                permissionsTitle={t("accessControl.permissions")}
                permissionsDescription={t("accessControl.permissionsDescription")}
                permissionsCountLabel={t("accessControl.permissionsCount", {
                  count: query.data.permissions.length,
                })}
                emptyGroupsLabel={t("accessControl.empty.permissionGroups")}
                emptyPermissionsLabel={t("accessControl.noPermissions")}
                groupCountLabel={(count) =>
                  t("accessControl.groupCount", { count })
                }
              />
            </TabsContent>

            <TabsContent value="roles">
              <RoleCatalogPanel
                data={query.data}
                getRoleText={getRoleText}
                rolesTitle={t("accessControl.roles")}
                rolesDescription={t("accessControl.rolesDescription")}
                rolesCountLabel={t("accessControl.rolesCount", {
                  count: query.data.roles.length,
                })}
                noRolesLabel={t("accessControl.noRoles")}
                noPermissionsLabel={t("accessControl.noPermissions")}
                permissionCountLabel={(count) =>
                  t("accessControl.groupCount", { count })
                }
                expandLabel={t("accessControl.actions.expandRolePermissions")}
                collapseLabel={t(
                  "accessControl.actions.collapseRolePermissions",
                )}
              />
            </TabsContent>
          </Tabs>
        </>
      ) : null}
    </div>
  );
}
