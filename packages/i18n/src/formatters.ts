import { interpolate } from "./interpolate";
import type {
  PluralCategory,
  PluralFormatOptions,
  PluralMessages,
  RelativeTimeUnit,
  Translate,
} from "./types";

export function createLocaleFormatters<TKey extends string>(options: {
  intlLocale: string;
  translate?: Translate<TKey>;
  unknownKey?: TKey;
}) {
  const formatNumber = (value: number, numberOptions?: Intl.NumberFormatOptions): string => {
    return new Intl.NumberFormat(options.intlLocale, numberOptions).format(value);
  };
  const formatBytes = (value: number | null): string => {
    if (value === null) {
      return options.unknownKey && options.translate
        ? options.translate(options.unknownKey)
        : "unknown";
    }

    if (value < 1024) {
      return `${formatNumber(value)} B`;
    }

    return `${formatNumber(value / 1024, { maximumFractionDigits: 1 })} KB`;
  };
  const formatDateTime = (value: Date | string): string => {
    return new Intl.DateTimeFormat(options.intlLocale, {
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      month: "short",
    }).format(toDate(value));
  };
  const formatTime = (value: Date | string): string => {
    return new Intl.DateTimeFormat(options.intlLocale, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(toDate(value));
  };
  const formatPlural = (
    value: number,
    forms: PluralMessages,
    pluralOptions: PluralFormatOptions = {},
  ): string => {
    const { values, ...rulesOptions } = pluralOptions;
    const category = new Intl.PluralRules(options.intlLocale, rulesOptions).select(
      value,
    ) as PluralCategory;
    const template = forms[category] ?? forms.other;

    return interpolate(template, {
      count: value,
      formattedCount: formatNumber(value),
      ...values,
    });
  };
  const formatRelativeTime = (value: number, unit: RelativeTimeUnit): string => {
    return new Intl.RelativeTimeFormat(options.intlLocale, {
      numeric: "auto",
    }).format(value, unit);
  };

  return {
    formatBytes,
    formatDateTime,
    formatNumber,
    formatPlural,
    formatRelativeTime,
    formatTime,
  };
}

function toDate(value: Date | string): Date {
  return value instanceof Date ? value : new Date(value);
}
