import type { Translate } from "../i18n";

export function latestTime(
  values: string[],
  formatDateTime: (value: string) => string,
  t: Translate,
): string | undefined {
  const latest = values
    .map((value) => new Date(value).getTime())
    .filter((value) => Number.isFinite(value))
    .sort((a, b) => b - a)[0];

  return latest
    ? t("common.latest", { value: formatDateTime(new Date(latest).toISOString()) })
    : undefined;
}
