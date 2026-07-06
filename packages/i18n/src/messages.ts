import { interpolate } from "./interpolate";
import type { Dictionary, LocaleDictionaries, Translate } from "./types";

export function createTranslator<TLocale extends string, TKey extends string>(options: {
  defaultLocale: TLocale;
  dictionaries: LocaleDictionaries<TLocale, TKey>;
  locale: TLocale;
}): Translate<TKey> {
  return (key, values) => {
    const template =
      options.dictionaries[options.locale][key] ??
      options.dictionaries[options.defaultLocale][key] ??
      key;

    return interpolate(template, values);
  };
}

export function defineMessages<const TMessages extends Dictionary>(messages: TMessages): TMessages {
  return messages;
}

export function hasMessageKey<TKey extends string>(
  dictionary: Dictionary<TKey>,
  key: string,
): key is TKey {
  return key in dictionary;
}
