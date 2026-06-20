import type { Page, Route } from "@playwright/test";
import { expect, test } from "../playwright-fixture";

function fulfillJson(route: Route, status: number, body: unknown) {
  return route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(body),
  });
}

async function mockUnauthenticatedSession(page: Page) {
  await page.route("**/api/auth/me*", route =>
    fulfillJson(route, 401, {
      statusCode: 401,
      message: "Unauthorized",
      error: "Unauthorized",
    }),
  );
}

async function mockAuthenticatedSession(page: Page) {
  let isAuthenticated = true;

  await page.route("**/api/auth/me*", route => {
    if (!isAuthenticated) {
      return fulfillJson(route, 401, {
        statusCode: 401,
        message: "Unauthorized",
        error: "Unauthorized",
      });
    }

    return fulfillJson(route, 200, {
      id: "user-1",
      email: "core@example.com",
      name: "Core User",
      provider: "google",
      avatarUrl: null,
      lastLoginAt: null,
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    });
  });

  await page.route("**/api/auth/logout*", route => {
    isAuthenticated = false;
    return route.fulfill({ status: 204 });
  });
}

test.describe("Smoke | Core shell", () => {
  test("redirects unauthenticated users to login", async ({ page }) => {
    const pageErrors: Error[] = [];
    page.on("pageerror", error => pageErrors.push(error));

    await mockUnauthenticatedSession(page);

    await page.goto("/");

    await expect(page).toHaveURL(/\/login$/);
    await expect(
      page.getByRole("heading", { name: "Entrar no sistema" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Entrar com Google" }),
    ).toBeVisible();
    expect(pageErrors).toEqual([]);
  });

  test("redirects authenticated users to the neutral app shell", async ({ page }) => {
    const pageErrors: Error[] = [];
    page.on("pageerror", error => pageErrors.push(error));

    await mockAuthenticatedSession(page);

    await page.goto("/");

    await expect(page).toHaveURL(/\/app$/);
    await expect(
      page.getByRole("heading", { name: "Nenhum modulo de produto ativo" }),
    ).toBeVisible();
    await expect(page.getByText("core@example.com")).toBeVisible();
    expect(pageErrors).toEqual([]);
  });

  test("redirects legacy finance routes to the neutral app shell", async ({ page }) => {
    const pageErrors: Error[] = [];
    page.on("pageerror", error => pageErrors.push(error));

    await mockAuthenticatedSession(page);

    await page.goto("/financeiro/transacoes/nova");

    await expect(page).toHaveURL(/\/app$/);
    await expect(
      page.getByRole("heading", { name: "Nenhum modulo de produto ativo" }),
    ).toBeVisible();
    expect(pageErrors).toEqual([]);
  });

  test("logs out authenticated users back to login", async ({ page }) => {
    const pageErrors: Error[] = [];
    page.on("pageerror", error => pageErrors.push(error));

    await mockAuthenticatedSession(page);

    await page.goto("/app");
    await page.getByRole("button", { name: "Sair" }).click();

    await expect(page).toHaveURL(/\/login$/);
    await expect(
      page.getByRole("heading", { name: "Entrar no sistema" }),
    ).toBeVisible();
    expect(pageErrors).toEqual([]);
  });

  test("keeps login as entrypoint and unknown routes go to 404", async ({ page }) => {
    const pageErrors: Error[] = [];
    page.on("pageerror", error => pageErrors.push(error));

    await mockUnauthenticatedSession(page);

    await page.goto("/rota-inexistente");
    await expect(page.getByRole("heading", { name: "404" })).toBeVisible();

    await page.goto("/");
    await expect(page).toHaveURL(/\/login$/);
    expect(pageErrors).toEqual([]);
  });
});
