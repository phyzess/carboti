import {
  createCodeLabeler,
  createLocaleFormatters,
  createTranslator,
  hasMessageKey,
  isKnownLocale,
  type PluralFormatOptions,
  type PluralMessages,
  type RelativeTimeUnit,
  type Translate as BaseTranslate,
} from "@carboti/i18n";
import { defaultLocale, localeOptions, storageKey, type Locale, type LocaleMeta } from "./locales";
import { messages, type MessageKey } from "./messages";

export type Translate = BaseTranslate<MessageKey>;

export type I18nRuntime = {
  t: Translate;
  formatBytes: (value: number | null) => string;
  formatDateTime: (value: string) => string;
  formatNumber: (value: number) => string;
  formatPlural: (value: number, forms: PluralMessages, options?: PluralFormatOptions) => string;
  formatRelativeTime: (value: number, unit: RelativeTimeUnit) => string;
  formatStatus: (status: string) => string;
  formatTime: (value: string) => string;
  roleLabel: (role: string) => string;
};

export function createI18nRuntime(locale: Locale, localeMeta: LocaleMeta): I18nRuntime {
  const t = createTranslator({
    defaultLocale,
    dictionaries: messages,
    locale,
  });
  const localeFormatters = createLocaleFormatters({
    intlLocale: localeMeta.intlLocale,
    translate: t,
    unknownKey: "common.unknown",
  });

  return {
    formatBytes: localeFormatters.formatBytes,
    formatDateTime: localeFormatters.formatDateTime,
    formatNumber: localeFormatters.formatNumber,
    formatPlural: localeFormatters.formatPlural,
    formatRelativeTime: localeFormatters.formatRelativeTime,
    formatStatus: createCodeLabeler({
      hasMessageKey: isMessageKey,
      prefix: "status",
      translate: t,
    }),
    formatTime: localeFormatters.formatTime,
    roleLabel: createCodeLabeler({
      hasMessageKey: isMessageKey,
      prefix: "role",
      translate: t,
    }),
    t,
  };
}

export function persistLocale(locale: Locale, localeMeta: LocaleMeta): void {
  window.localStorage.setItem(storageKey, locale);
  document.documentElement.lang = localeMeta.htmlLang;
}

export function readStoredLocale(): Locale {
  const stored = window.localStorage.getItem(storageKey);
  return isKnownLocale(stored, localeOptions) ? stored : defaultLocale;
}

function isMessageKey(key: string): key is MessageKey {
  return hasMessageKey(messages[defaultLocale], key);
}
