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

test.describe("Smoke | Finance", () => {
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

  test("keeps finance as entrypoint and unknown routes go to 404", async ({ page }) => {
    const pageErrors: Error[] = [];
    page.on("pageerror", error => pageErrors.push(error));

    await mockUnauthenticatedSession(page);

    await page.goto("/rota-inexistente");
    await expect(page.getByRole("heading", { name: "404" })).toBeVisible();

    await page.goto("/");
    await expect(page).toHaveURL(/\/financeiro$/);
    expect(pageErrors).toEqual([]);
  });
});
