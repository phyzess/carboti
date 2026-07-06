import type { LocaleMetadata } from "@carboti/i18n";

export const localeOptions = [
  {
    id: "en",
    label: "English",
    shortLabel: "EN",
    htmlLang: "en",
    intlLocale: "en-GB",
  },
  {
    id: "zh-CN",
    label: "简体中文",
    shortLabel: "中",
    htmlLang: "zh-CN",
    intlLocale: "zh-CN",
  },
] as const satisfies readonly LocaleMetadata<string>[];

export type Locale = (typeof localeOptions)[number]["id"];
export type LocaleMeta = LocaleMetadata<Locale>;

const configuredDefaultLocale = import.meta.env.VITE_QITU_DEFAULT_LOCALE;

export const defaultLocale: Locale = isConfiguredLocale(configuredDefaultLocale)
  ? configuredDefaultLocale
  : "en";
export const storageKey = "qitu.locale";

function isConfiguredLocale(value: string | undefined): value is Locale {
  return localeOptions.some((option) => option.id === value);
}
