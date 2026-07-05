import type { Page, Route } from "@playwright/test";

import { expect, test } from "../playwright-fixture";

const FILTERS_BUTTON_NAME = /^(Filters|Filtros)$/;
const SEARCH_PERMISSIONS_PLACEHOLDER =
  /^(Search by label, description, key, group or action|Busque por rótulo, descrição, chave, grupo ou ação)$/;
const FILTER_PERMISSIONS_TITLE = /^(Filter permissions|Filtrar permissões)$/;
const SHOW_ACCESS_CONTROL_PERMISSIONS_NAME =
  /^(Show Access Control permissions|Mostrar permissões de Controle de acesso)$/;
const SHOW_USERS_PERMISSIONS_NAME =
  /^(Show Users permissions|Mostrar permissões de Usuários)$/;
const SEARCH_MANAGE_CHIP = /^(Search|Busca): manage$/;
const CLEAR_BUTTON_NAME = /^(Clear|Limpar)$/;

function fulfillJson(route: Route, status: number, body: unknown) {
  return route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(body),
  });
}

async function mockAuthenticatedAccessControl(page: Page) {
  await page.addInitScript(() => {
    window.localStorage.setItem("i18nextLng", "en");
  });

  await page.route(/\/api\/auth\/me(?:\?.*)?$/, (route) =>
    fulfillJson(route, 200, {
      id: "user-1",
      email: "access@example.com",
      name: "Access User",
      provider: "google",
      permissions: ["core:access", "access-control:access"],
      roles: ["admin"],
      avatarUrl: null,
      lastLoginAt: null,
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    }),
  );

  await page.route(/\/api\/access-control(?:\?.*)?$/, (route) =>
    fulfillJson(route, 200, {
      module: "access-control",
      status: "available",
      permissions: [
        {
          id: "permission-1",
          key: "access-control:access",
          moduleId: "access-control",
          groupId: "group-access-control",
          action: "access",
          label: "Access access control",
          description: "Open the access control module.",
        },
        {
          id: "permission-2",
          key: "users:read",
          moduleId: "users",
          groupId: "group-users",
          action: "read",
          label: "Read users",
          description: "Read the user directory.",
        },
        {
          id: "permission-3",
          key: "users:manage",
          moduleId: "users",
          groupId: "group-users",
          action: "manage",
          label: "Manage users",
          description: "Manage user records.",
        },
      ],
      permissionGroups: [
        {
          id: "group-access-control",
          key: "access-control",
          label: "Access Control",
          description: "Roles, permissions and access overview.",
          sortOrder: 1,
          permissions: [
            {
              id: "permission-1",
              key: "access-control:access",
              moduleId: "access-control",
              groupId: "group-access-control",
              action: "access",
              label: "Access access control",
              description: "Open the access control module.",
            },
          ],
        },
        {
          id: "group-users",
          key: "users",
          label: "Users",
          description: "Authenticated user directory and profile visibility.",
          sortOrder: 2,
          permissions: [
            {
              id: "permission-2",
              key: "users:read",
              moduleId: "users",
              groupId: "group-users",
              action: "read",
              label: "Read users",
              description: "Read the user directory.",
            },
            {
              id: "permission-3",
              key: "users:manage",
              moduleId: "users",
              groupId: "group-users",
              action: "manage",
              label: "Manage users",
              description: "Manage user records.",
            },
          ],
        },
      ],
      roles: [
        {
          id: "role-1",
          key: "admin",
          label: "Administrator",
          description: "Full access to core administration features.",
          permissions: [
            {
              id: "permission-1",
              key: "access-control:access",
              moduleId: "access-control",
              groupId: "group-access-control",
              action: "access",
              label: "Access access control",
              description: "Open the access control module.",
            },
            {
              id: "permission-3",
              key: "users:manage",
              moduleId: "users",
              groupId: "group-users",
              action: "manage",
              label: "Manage users",
              description: "Manage user records.",
            },
          ],
        },
      ],
    }),
  );
}

test.describe("Access control | responsive layout", () => {
  test("shows side summary and inline filters on xl desktop", async ({
    page,
  }) => {
    const pageErrors: Error[] = [];
    page.on("pageerror", (error) => pageErrors.push(error));

    await page.setViewportSize({ width: 1440, height: 1200 });
    await mockAuthenticatedAccessControl(page);
    await page.goto("/access-control");

    await expect(
      page.locator("[data-testid='access-control-summary-cards'] > *"),
    ).toHaveCount(4);
    await expect(page.locator("input[type='search']").first()).toBeVisible();
    await expect(
      page.getByRole("button", { name: FILTERS_BUTTON_NAME }),
    ).toBeHidden();

    const summaryBox = await page
      .locator("[data-testid='access-control-summary-cards']")
      .boundingBox();
    const catalogBox = await page
      .getByRole("tablist")
      .locator("..")
      .boundingBox();

    expect(summaryBox).not.toBeNull();
    expect(catalogBox).not.toBeNull();
    expect(summaryBox!.x + summaryBox!.width).toBeLessThan(catalogBox!.x + 8);
    expect(pageErrors).toEqual([]);
  });

  test("shows mobile summary strip and opens the permission filter sheet", async ({
    page,
  }) => {
    const pageErrors: Error[] = [];
    page.on("pageerror", (error) => pageErrors.push(error));

    await page.setViewportSize({ width: 390, height: 844 });
    await mockAuthenticatedAccessControl(page);
    await page.goto("/access-control");

    await expect(page.locator("input[type='search']").first()).toBeHidden();
    await expect(
      page.getByRole("button", { name: FILTERS_BUTTON_NAME }),
    ).toBeVisible();
    await expect(
      page.locator("[data-testid='access-control-summary-cards']"),
    ).toBeVisible();

    await page.getByRole("button", { name: FILTERS_BUTTON_NAME }).click();
    await expect(
      page.getByRole("heading", { name: FILTER_PERMISSIONS_TITLE }),
    ).toBeVisible();
    await expect(
      page.getByRole("dialog").getByPlaceholder(SEARCH_PERMISSIONS_PLACEHOLDER),
    ).toBeVisible();

    const hasPageOverflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    );

    expect(hasPageOverflow).toBe(false);
    expect(pageErrors).toEqual([]);
  });

  test("collapses permission groups on mobile and auto-reveals matches when filtering", async ({
    page,
  }) => {
    const pageErrors: Error[] = [];
    page.on("pageerror", (error) => pageErrors.push(error));

    await page.setViewportSize({ width: 390, height: 844 });
    await mockAuthenticatedAccessControl(page);
    await page.goto("/access-control");

    const accessControlGroupToggle = page.getByRole("button", {
      name: SHOW_ACCESS_CONTROL_PERMISSIONS_NAME,
    });
    const usersGroupToggle = page.getByRole("button", {
      name: SHOW_USERS_PERMISSIONS_NAME,
    });

    await expect(usersGroupToggle).toBeVisible();
    await expect(accessControlGroupToggle).toBeVisible();
    await expect(page.getByText("users:read")).toBeHidden();

    await accessControlGroupToggle.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByText("access-control:access")).toBeVisible();

    await page.getByRole("button", { name: FILTERS_BUTTON_NAME }).click();
    await page
      .getByRole("dialog")
      .getByPlaceholder(SEARCH_PERMISSIONS_PLACEHOLDER)
      .fill("manage");
    await page.keyboard.press("Escape");

    await expect(page.getByText("users:manage")).toBeVisible();
    await expect(page.getByText(SEARCH_MANAGE_CHIP)).toBeVisible();

    await page.getByRole("button", { name: CLEAR_BUTTON_NAME }).click();
    await expect(page.getByText(SEARCH_MANAGE_CHIP)).toBeHidden();
    await expect(page.getByText("users:manage")).toBeHidden();
    expect(pageErrors).toEqual([]);
  });
});
