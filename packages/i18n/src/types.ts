export type MessageValues = Record<string, number | string>;

export type Dictionary<TKey extends string = string> = Record<TKey, string>;

export type PluralCategory = "zero" | "one" | "two" | "few" | "many" | "other";

export type PluralMessages = Partial<Record<PluralCategory, string>> & {
  other: string;
};

export type PluralFormatOptions = Intl.PluralRulesOptions & {
  values?: MessageValues;
};

export type RelativeTimeUnit = Intl.RelativeTimeFormatUnit;

export type LocaleMetadata<TLocale extends string = string> = {
  id: TLocale;
  htmlLang: string;
  intlLocale: string;
  label: string;
  shortLabel: string;
};

export type LocaleDictionaries<TLocale extends string, TKey extends string> = Record<
  TLocale,
  Dictionary<TKey>
>;

export type Translate<TKey extends string = string> = (key: TKey, values?: MessageValues) => string;
