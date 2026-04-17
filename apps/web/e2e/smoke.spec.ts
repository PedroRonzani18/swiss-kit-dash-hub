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

test.describe("Smoke | Modules", () => {
  test("redirects to finance and shows unauthenticated state", async ({ page }) => {
    const pageErrors: Error[] = [];
    page.on("pageerror", error => pageErrors.push(error));

    await mockUnauthenticatedSession(page);

    await page.goto("/");

    await expect(page).toHaveURL(/\/financeiro$/);
    await expect(
      page.getByRole("heading", { name: "Acesse seu dashboard financeiro" }),
    ).toBeVisible();
    await expect(
      page.getByRole("main").getByRole("button", { name: "Entrar com Google" }),
    ).toBeVisible();
    expect(pageErrors).toEqual([]);
  });

  test("navigates between module pages via sidebar", async ({ page }) => {
    const pageErrors: Error[] = [];
    page.on("pageerror", error => pageErrors.push(error));

    await mockUnauthenticatedSession(page);

    await page.goto("/animes");
    await expect(page.getByRole("heading", { name: "Hub de Animes" })).toBeVisible();

    await page.getByRole("link", { name: "Ferramentas" }).click();
    await expect(page).toHaveURL(/\/ferramentas$/);
    await expect(
      page.getByRole("heading", { name: "Central de Ferramentas" }),
    ).toBeVisible();

    await page.getByRole("link", { name: "Configuracoes" }).click();
    await expect(page).toHaveURL(/\/configuracoes$/);
    await expect(
      page.getByRole("heading", { name: "Preferências da Plataforma" }),
    ).toBeVisible();

    await page.getByRole("link", { name: "Financeiro" }).click();
    await expect(page).toHaveURL(/\/financeiro$/);
    await expect(
      page.getByRole("heading", { name: "Acesse seu dashboard financeiro" }),
    ).toBeVisible();
    expect(pageErrors).toEqual([]);
  });
});
