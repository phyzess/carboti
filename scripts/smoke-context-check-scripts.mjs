export function createCheckScriptsContext({ text }) {
  const packageInterfaceTests = [
    text("scripts/package-interface-tests.mjs"),
    text("scripts/package-interface-runtime.mjs"),
    text("scripts/package-interface-auth-db-guards.mjs"),
    text("scripts/package-interface-import-guards.mjs"),
    text("scripts/package-interface-i18n-rbac-guards.mjs"),
    text("scripts/package-interface-sdk-guards.mjs"),
    text("scripts/package-interface-template-web-guards.mjs"),
  ].join("\n");
  const i18nCheck = [
    text("scripts/i18n-check.mjs"),
    text("scripts/i18n-check-context.mjs"),
    text("scripts/i18n-check-io.mjs"),
    text("scripts/i18n-check-message-keys.mjs"),
    text("scripts/i18n-check-package-guards.mjs"),
    text("scripts/i18n-check-web-guards.mjs"),
    text("scripts/i18n-check-worker-guards.mjs"),
    text("scripts/i18n-check-template-guards.mjs"),
  ].join("\n");

  return {
    i18nCheck,
    packageInterfaceTests,
  };
}
