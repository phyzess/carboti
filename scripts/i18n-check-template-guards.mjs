export function assertI18nTemplateAndSmokeCoverage({ assert, appTemplateManifest, packageJson }) {
  assert(
    appTemplateManifest.copy.includes("packages/i18n") &&
      appTemplateManifest.copy.includes("scripts/i18n-check.mjs"),
    "app template manifest must copy the i18n package and check.",
  );
  assert(
    packageJson.scripts.smoke.includes("i18n-check.mjs"),
    "smoke script must run the i18n invariant check.",
  );
}
