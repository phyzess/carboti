import type { LocaleMetadata } from "./types";

export function isKnownLocale<TLocale extends string>(
  value: string | null | undefined,
  localeOptions: readonly LocaleMetadata<TLocale>[],
): value is TLocale {
  return localeOptions.some((option) => option.id === value);
}

export function resolveLocale<TLocale extends string>(options: {
  candidates: readonly (string | null | undefined)[];
  defaultLocale: TLocale;
  localeOptions: readonly LocaleMetadata<TLocale>[];
}): TLocale {
  for (const candidate of options.candidates) {
    const locale = matchLocaleCandidate(candidate, options.localeOptions);
    if (locale) return locale;
  }

  return options.defaultLocale;
}

export function localeCandidatesFromAcceptLanguage(value: string | null | undefined): string[] {
  if (!value) return [];

  return value
    .split(",")
    .map((entry, index) => {
      const [tag = "", ...parameters] = entry.trim().split(";");
      const quality = parameters
        .map((parameter) => parameter.trim())
        .find((parameter) => parameter.startsWith("q="));
      const parsedQuality = quality ? Number(quality.slice(2)) : 1;

      return {
        index,
        quality: Number.isFinite(parsedQuality) ? parsedQuality : 0,
        tag: tag.trim(),
      };
    })
    .filter((entry) => entry.tag && entry.quality > 0)
    .sort((left, right) => right.quality - left.quality || left.index - right.index)
    .map((entry) => entry.tag);
}

export function nextLocale<TLocale extends string>(
  current: TLocale,
  localeOptions: readonly LocaleMetadata<TLocale>[],
): TLocale {
  const first = localeOptions[0];
  if (!first) {
    throw new Error("localeOptions must include at least one locale.");
  }

  const currentIndex = localeOptions.findIndex((option) => option.id === current);
  return localeOptions[(currentIndex + 1) % localeOptions.length]?.id ?? first.id;
}

function matchLocaleCandidate<TLocale extends string>(
  value: string | null | undefined,
  localeOptions: readonly LocaleMetadata<TLocale>[],
): TLocale | null {
  if (!value) return null;

  const normalized = value.trim().toLowerCase();
  if (!normalized || normalized === "*") return null;

  for (const option of localeOptions) {
    if (
      option.id.toLowerCase() === normalized ||
      option.htmlLang.toLowerCase() === normalized ||
      option.intlLocale.toLowerCase() === normalized
    ) {
      return option.id;
    }
  }

  const baseLanguage = normalized.split("-")[0];
  if (!baseLanguage) return null;

  return (
    localeOptions.find((option) => {
      return (
        option.id.toLowerCase().split("-")[0] === baseLanguage ||
        option.htmlLang.toLowerCase().split("-")[0] === baseLanguage ||
        option.intlLocale.toLowerCase().split("-")[0] === baseLanguage
      );
    })?.id ?? null
  );
}
