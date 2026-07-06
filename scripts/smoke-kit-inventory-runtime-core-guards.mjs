export function assertRuntimeCoreInventoryGuards(context) {
  for (const file of [
    "scripts/doctor.mjs",
    "scripts/doctor-checks.mjs",
    "scripts/doctor-io.mjs",
    "scripts/doctor-output.mjs",
    "scripts/doctor-registry-checks.mjs",
    "scripts/doctor-starter-checks.mjs",
    "scripts/doctor-toolchain-checks.mjs",
    "scripts/dev-all.mjs",
    "scripts/dev-all-config.mjs",
    "scripts/dev-all-ports.mjs",
    "scripts/dev-all-runner.mjs",
    "scripts/setup-local.mjs",
    "scripts/adopt-app.mjs",
    "scripts/adopt-app-args.mjs",
    "scripts/adopt-app-replacements.mjs",
    "scripts/adopt-app-files.mjs",
    "scripts/adopt-app-file-apply.mjs",
    "scripts/adopt-app-file-collection.mjs",
    "scripts/adopt-app-file-edits.mjs",
    "scripts/adopt-app-output.mjs",
    "scripts/package-interface-tests.mjs",
    "scripts/package-interface-runtime.mjs",
    "scripts/package-interface-auth-db-guards.mjs",
    "scripts/package-interface-import-guards.mjs",
    "scripts/package-interface-i18n-rbac-guards.mjs",
    "scripts/package-interface-sdk-guards.mjs",
    "scripts/package-interface-template-web-guards.mjs",
    "scripts/i18n-check.mjs",
    "scripts/i18n-check-context.mjs",
    "scripts/i18n-check-io.mjs",
    "scripts/i18n-check-message-keys.mjs",
    "scripts/i18n-check-package-guards.mjs",
    "scripts/i18n-check-web-guards.mjs",
    "scripts/i18n-check-worker-guards.mjs",
    "scripts/i18n-check-template-guards.mjs",
    "scripts/wrangler-d1-migrate-local.mjs",
    "scripts/wrangler-d1-migrate-local-config.mjs",
    "scripts/wrangler-d1-migrate-local-output.mjs",
    "scripts/wrangler-d1-migrate-local-runner.mjs",
    "scripts/wrangler-d1-migrate-local-success.mjs",
  ]) {
    assertExists(context, file);
  }
}

function assertExists({ assert, exists }, file) {
  assert(exists(file), `${file} must exist.`);
}
