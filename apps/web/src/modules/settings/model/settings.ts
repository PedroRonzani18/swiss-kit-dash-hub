export type UserCurrency = "BRL" | "USD" | "EUR";

export type UserSettings = {
  displayName: string;
  email: string;
  timezone: string;
  currency: UserCurrency;
  digestByEmail: boolean;
  instantAlerts: boolean;
  weeklySummary: boolean;
  compactTables: boolean;
  enable2fa: boolean;
  googleCalendarSync: boolean;
  notionSync: boolean;
};

export const SETTINGS_STORAGE_KEY = "swisskit.module.settings.v1";

export const DEFAULT_SETTINGS: UserSettings = {
  displayName: "Pedro Ronzani",
  email: "pedro@example.com",
  timezone: "America/Sao_Paulo",
  currency: "BRL",
  digestByEmail: true,
  instantAlerts: true,
  weeklySummary: true,
  compactTables: false,
  enable2fa: false,
  googleCalendarSync: false,
  notionSync: false,
};

export const USER_CURRENCY_OPTIONS: Array<{
  value: UserCurrency;
  label: string;
}> = [
  { value: "BRL", label: "BRL (R$)" },
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
];

export const USER_TIMEZONE_OPTIONS = [
  "America/Sao_Paulo",
  "America/New_York",
  "Europe/Lisbon",
] as const;
