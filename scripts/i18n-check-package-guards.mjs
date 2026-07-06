export function assertI18nPackageBoundary({ assert, exists, packageI18n }) {
  for (const forbidden of [
    "react",
    "ReactNode",
    "document.",
    "window.",
    "apps/",
    "Operator access",
    "Accept invitation",
    "Source files",
    "Confirmation console",
  ]) {
    assert(
      !packageI18n.includes(forbidden),
      `packages/i18n must not depend on app/runtime concerns or web copy: ${forbidden}`,
    );
  }

  assert(
    packageI18n.includes("Intl.PluralRules") && packageI18n.includes("Intl.RelativeTimeFormat"),
    "packages/i18n must expose plural and relative-time primitives.",
  );
  assert(
    packageI18n.includes("localeCandidatesFromAcceptLanguage") &&
      packageI18n.includes("resolveLocale") &&
      exists("packages/i18n/src/locale.ts") &&
      exists("packages/i18n/src/formatters.ts") &&
      exists("packages/i18n/src/messages.ts"),
    "packages/i18n must expose reusable locale negotiation helpers.",
  );
}
