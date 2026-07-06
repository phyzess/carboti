export function assertI18nCoverageGuards(context) {
  const { assert, i18nCheck } = context;

  assert(
    i18nCheck.includes("packages/i18n must not depend on app/runtime concerns") &&
      i18nCheck.includes("zh-CN dictionary is missing key") &&
      i18nCheck.includes("visible English UI copy must come from the web dictionary"),
    "i18n check must protect package boundaries, dictionary completeness, and hard-coded UI copy.",
  );
}
