import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { normalizeLanguage } from "./index";

export function LocaleDocument() {
  const { i18n, t } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = normalizeLanguage(i18n.resolvedLanguage);
    document.title = t("metadata.title");

    const description = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );
    description?.setAttribute("content", t("metadata.description"));

    document
      .querySelectorAll<HTMLMetaElement>(
        'meta[property="og:title"], meta[name="twitter:title"]',
      )
      .forEach((meta) => meta.setAttribute("content", t("metadata.title")));
    document
      .querySelectorAll<HTMLMetaElement>(
        'meta[property="og:description"], meta[name="twitter:description"]',
      )
      .forEach((meta) =>
        meta.setAttribute("content", t("metadata.description")),
      );
  }, [i18n.resolvedLanguage, t]);

  return null;
}
