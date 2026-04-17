import { describe, expect, it } from "vitest";
import { DEFAULT_SETTINGS } from "./settings";
import { parseStoredSettings } from "./settingsStorage";

describe("parseStoredSettings", () => {
  it("returns null when payload is not parseable", () => {
    expect(parseStoredSettings(null)).toBeNull();
    expect(parseStoredSettings("{invalid-json")).toBeNull();
    expect(parseStoredSettings('"string-value"')).toBeNull();
  });

  it("hydrates defaults for missing fields", () => {
    const serialized = JSON.stringify({
      displayName: "Ana",
      email: "ana@example.com",
      timezone: "Europe/Lisbon",
      currency: "USD",
    });

    expect(parseStoredSettings(serialized)).toEqual({
      ...DEFAULT_SETTINGS,
      displayName: "Ana",
      email: "ana@example.com",
      timezone: "Europe/Lisbon",
      currency: "USD",
    });
  });

  it("keeps boolean defaults when values are invalid", () => {
    const serialized = JSON.stringify({
      digestByEmail: "true",
      instantAlerts: 1,
      weeklySummary: null,
      compactTables: "false",
    });

    expect(parseStoredSettings(serialized)).toEqual({
      ...DEFAULT_SETTINGS,
    });
  });

  it("falls back to BRL when currency is invalid", () => {
    const serialized = JSON.stringify({
      currency: "JPY",
    });

    expect(parseStoredSettings(serialized)).toEqual({
      ...DEFAULT_SETTINGS,
      currency: "BRL",
    });
  });
});
