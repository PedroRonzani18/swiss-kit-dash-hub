import {
  DEFAULT_LANGUAGE,
  normalizeLanguage,
  SUPPORTED_LANGUAGES,
} from "./index";

describe("i18n locale normalization", () => {
  it("keeps English browser variants in the supported English locale", () => {
    expect(normalizeLanguage("en-US")).toBe("en");
    expect(normalizeLanguage("en")).toBe("en");
  });

  it("falls back unsupported and missing locales to Brazilian Portuguese", () => {
    expect(normalizeLanguage("es-AR")).toBe(DEFAULT_LANGUAGE);
    expect(normalizeLanguage(undefined)).toBe(DEFAULT_LANGUAGE);
  });

  it("exposes only the initial supported languages", () => {
    expect(SUPPORTED_LANGUAGES).toEqual(["pt-BR", "en"]);
  });
});
