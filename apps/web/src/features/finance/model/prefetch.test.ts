import { describe, expect, it } from "vitest";
import {
  shouldResetFinancePrefetch,
  shouldRunFinancePrefetch,
} from "./prefetch";

describe("finance prefetch orchestration", () => {
  it("resets prefetch state when user is unauthenticated", () => {
    expect(shouldResetFinancePrefetch(false)).toBe(true);
    expect(shouldResetFinancePrefetch(true)).toBe(false);
  });

  it("runs prefetch only when authenticated, not loading, and not prefetched yet", () => {
    expect(
      shouldRunFinancePrefetch({
        isAuthLoading: false,
        isAuthenticated: true,
        hasPrefetched: false,
      }),
    ).toBe(true);

    expect(
      shouldRunFinancePrefetch({
        isAuthLoading: true,
        isAuthenticated: true,
        hasPrefetched: false,
      }),
    ).toBe(false);

    expect(
      shouldRunFinancePrefetch({
        isAuthLoading: false,
        isAuthenticated: false,
        hasPrefetched: false,
      }),
    ).toBe(false);

    expect(
      shouldRunFinancePrefetch({
        isAuthLoading: false,
        isAuthenticated: true,
        hasPrefetched: true,
      }),
    ).toBe(false);
  });
});
