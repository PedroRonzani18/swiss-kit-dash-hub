import {
  DEFAULT_SETTINGS,
  type UserCurrency,
  type UserSettings,
} from "./settings";

function parseCurrency(value: unknown): UserCurrency {
  if (value === "USD" || value === "EUR") {
    return value;
  }

  return "BRL";
}

function parseString(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}

function parseBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

export function parseStoredSettings(serialized: string | null): UserSettings | null {
  if (!serialized) {
    return null;
  }

  try {
    const parsed = JSON.parse(serialized) as Record<string, unknown>;
    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    return {
      displayName: parseString(
        parsed.displayName,
        DEFAULT_SETTINGS.displayName,
      ),
      email: parseString(parsed.email, DEFAULT_SETTINGS.email),
      timezone: parseString(parsed.timezone, DEFAULT_SETTINGS.timezone),
      currency: parseCurrency(parsed.currency),
      digestByEmail: parseBoolean(
        parsed.digestByEmail,
        DEFAULT_SETTINGS.digestByEmail,
      ),
      instantAlerts: parseBoolean(
        parsed.instantAlerts,
        DEFAULT_SETTINGS.instantAlerts,
      ),
      weeklySummary: parseBoolean(
        parsed.weeklySummary,
        DEFAULT_SETTINGS.weeklySummary,
      ),
      compactTables: parseBoolean(
        parsed.compactTables,
        DEFAULT_SETTINGS.compactTables,
      ),
      enable2fa: parseBoolean(parsed.enable2fa, DEFAULT_SETTINGS.enable2fa),
      googleCalendarSync: parseBoolean(
        parsed.googleCalendarSync,
        DEFAULT_SETTINGS.googleCalendarSync,
      ),
      notionSync: parseBoolean(parsed.notionSync, DEFAULT_SETTINGS.notionSync),
    };
  } catch {
    return null;
  }
}
