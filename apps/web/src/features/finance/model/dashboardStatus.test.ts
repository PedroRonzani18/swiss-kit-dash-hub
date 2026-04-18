import { describe, expect, it } from "vitest";
import { getFinanceDashboardStatus } from "./dashboardStatus";

describe("finance dashboard orchestration status", () => {
  it("reports initial loading when not all resources were fetched", () => {
    const status = getFinanceDashboardStatus({
      accounts: { hasFetched: true, error: null },
      categories: { hasFetched: false, error: null },
      transactions: { hasFetched: true, error: null },
    });

    expect(status.isInitialLoading).toBe(true);
    expect(status.error).toBe(null);
  });

  it("reports first available error with loading completed", () => {
    const error = new Error("transactions failed");

    const status = getFinanceDashboardStatus({
      accounts: { hasFetched: true, error: null },
      categories: { hasFetched: true, error: null },
      transactions: { hasFetched: true, error },
    });

    expect(status.isInitialLoading).toBe(false);
    expect(status.error).toBe(error);
  });

  it("prioritizes account error before other sources", () => {
    const accountsError = new Error("accounts failed");
    const categoriesError = new Error("categories failed");

    const status = getFinanceDashboardStatus({
      accounts: { hasFetched: true, error: accountsError },
      categories: { hasFetched: true, error: categoriesError },
      transactions: { hasFetched: true, error: null },
    });

    expect(status.error).toBe(accountsError);
  });
});
