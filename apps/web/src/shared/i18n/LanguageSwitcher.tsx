import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  DEFAULT_LANGUAGE,
  normalizeLanguage,
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
} from "./index";

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const selectedLanguage =
    normalizeLanguage(i18n.resolvedLanguage) ?? DEFAULT_LANGUAGE;

  const handleLanguageChange = (language: SupportedLanguage) => {
    void i18n.changeLanguage(language);
  };

  return (
    <label className="flex items-center gap-2 text-xs text-muted-foreground">
      <Languages className="h-4 w-4" aria-hidden="true" />
      <span className="sr-only">{t("common.language")}</span>
      <select
        aria-label={t("common.language")}
        className="rounded-md border border-border/80 bg-surface-subtle px-2 py-1.5 text-xs text-foreground outline-none focus:border-brand/50"
        onChange={(event) =>
          handleLanguageChange(event.target.value as SupportedLanguage)
        }
        value={selectedLanguage}
      >
        {SUPPORTED_LANGUAGES.map((language) => (
          <option key={language} value={language}>
            {t(`common.languages.${language}`)}
          </option>
        ))}
      </select>
    </label>
  );
}
