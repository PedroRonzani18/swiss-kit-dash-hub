import type { AccessControlOverviewContract } from "@swisskit/contracts/access-control";
import type { UseQueryResult } from "@tanstack/react-query";

import { useTranslation } from "react-i18next";

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
      {query.isLoading ? (
        <div className="space-y-4 xl:grid xl:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] xl:items-start xl:gap-6 xl:space-y-0">
          <div className="flex gap-4 overflow-hidden sm:grid sm:grid-cols-2 xl:grid-cols-1">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-28 min-w-[11rem] rounded-xl sm:min-w-0 sm:h-32"
              />
            ))}
          </div>
          <div className="space-y-4">
            <Skeleton className="h-12 w-64 rounded-lg" />
            <Skeleton className="h-96 rounded-xl" />
          </div>
        </div>
      ) : null}

      {query.isError ? (
        <SectionCard title={t("accessControl.title")}>
          <p className="text-sm text-destructive">{t("accessControl.error")}</p>
        </SectionCard>
      ) : null}

      {query.data ? (
        <div className="space-y-6 xl:grid xl:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] xl:items-start xl:gap-6 xl:space-y-0">
          <AccessControlSummaryCards
            data={query.data}
            labels={{
              permissions: t("accessControl.summary.permissions"),
              roles: t("accessControl.summary.roles"),
              groups: t("accessControl.summary.groups"),
              managePermissions: t("accessControl.summary.managePermissions"),
            }}
          />

          <Tabs defaultValue="permissions" className="min-w-0 space-y-0">
            <div className="rounded-2xl border border-border/60 bg-card shadow-business-sm">
              <div className="border-b border-border/60 px-3 py-3 md:px-4">
                <TabsList className="h-auto w-full justify-start rounded-xl border border-border/50 bg-surface-subtle/45 p-1">
                  <TabsTrigger
                    value="permissions"
                    className="flex-1 justify-center rounded-lg px-4 py-2 text-sm md:flex-none"
                  >
                    {t("accessControl.tabs.permissions")}
                  </TabsTrigger>
                  <TabsTrigger
                    value="roles"
                    className="flex-1 justify-center rounded-lg px-4 py-2 text-sm md:flex-none"
                  >
                    {t("accessControl.tabs.roles")}
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="permissions" className="mt-0 p-3 md:p-4">
                <PermissionCatalogPanel
                  data={query.data}
                  getGroupText={getGroupText}
                  getPermissionText={getPermissionText}
                  permissionsTitle={t("accessControl.permissions")}
                  permissionsDescription={t("accessControl.permissionsDescription")}
                  permissionsCountLabel={(count) =>
                    t("accessControl.permissionsCount", { count })
                  }
                  emptyGroupsLabel={t("accessControl.empty.permissionGroups")}
                  emptyPermissionsLabel={t("accessControl.noPermissions")}
                  filteredPermissionsLabel={t(
                    "accessControl.filters.filteredPermissions",
                  )}
                  groupCountLabel={(count) =>
                    t("accessControl.groupCount", { count })
                  }
                  permissionsSearchLabel={t(
                    "accessControl.filters.permissionsSearchLabel",
                  )}
                  permissionsSearchPlaceholder={t(
                    "accessControl.filters.permissionsSearchPlaceholder",
                  )}
                  actionLabel={t("accessControl.filters.actionLabel")}
                  allActionsLabel={t("accessControl.filters.allActions")}
                  clearFiltersLabel={t("accessControl.filters.clear")}
                  actionOptionLabel={(action) =>
                    t(`accessControl.filters.actions.${action}`)
                  }
                  searchFilterLabel={(value) =>
                    t("accessControl.filters.searchFilter", { value })
                  }
                  actionFilterLabel={(value) =>
                    t("accessControl.filters.actionFilter", { value })
                  }
                  openFiltersLabel={t("accessControl.filters.openFilters")}
                  mobileFiltersTitle={t(
                    "accessControl.filters.permissionsSheetTitle",
                  )}
                  mobileFiltersDescription={t(
                    "accessControl.filters.permissionsSheetDescription",
                  )}
                  expandGroupLabel={(groupLabel) =>
                    t("accessControl.actions.expandPermissionGroup", {
                      group: groupLabel,
                    })
                  }
                  collapseGroupLabel={(groupLabel) =>
                    t("accessControl.actions.collapsePermissionGroup", {
                      group: groupLabel,
                    })
                  }
                  emptyFilteredPermissionsTitle={t(
                    "accessControl.filters.emptyFilteredPermissionsTitle",
                  )}
                  emptyFilteredPermissionsDescription={t(
                    "accessControl.filters.emptyFilteredPermissionsDescription",
                  )}
                />
              </TabsContent>

              <TabsContent value="roles" className="mt-0 p-3 md:p-4">
                <RoleCatalogPanel
                  data={query.data}
                  getRoleText={getRoleText}
                  rolesTitle={t("accessControl.roles")}
                  rolesDescription={t("accessControl.rolesDescription")}
                  rolesCountLabel={(count) =>
                    t("accessControl.rolesCount", { count })
                  }
                  noRolesLabel={t("accessControl.noRoles")}
                  filteredRolesLabel={t("accessControl.filters.filteredRoles")}
                  noPermissionsLabel={t("accessControl.noPermissions")}
                  permissionCountLabel={(count) =>
                    t("accessControl.groupCount", { count })
                  }
                  expandLabel={t("accessControl.actions.expandRolePermissions")}
                  collapseLabel={t(
                    "accessControl.actions.collapseRolePermissions",
                  )}
                  rolesSearchLabel={t("accessControl.filters.rolesSearchLabel")}
                  rolesSearchPlaceholder={t(
                    "accessControl.filters.rolesSearchPlaceholder",
                  )}
                  clearFiltersLabel={t("accessControl.filters.clear")}
                  searchFilterLabel={(value) =>
                    t("accessControl.filters.searchFilter", { value })
                  }
                  openFiltersLabel={t("accessControl.filters.openFilters")}
                  mobileFiltersTitle={t(
                    "accessControl.filters.rolesSheetTitle",
                  )}
                  mobileFiltersDescription={t(
                    "accessControl.filters.rolesSheetDescription",
                  )}
                  emptyFilteredRolesTitle={t(
                    "accessControl.filters.emptyFilteredRolesTitle",
                  )}
                  emptyFilteredRolesDescription={t(
                    "accessControl.filters.emptyFilteredRolesDescription",
                  )}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      ) : null}
    </div>
  );
}
