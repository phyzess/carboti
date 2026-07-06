export function assertRuntimeBrowserSmokeInventoryGuards(context) {
  for (const file of [
    "scripts/browser-smoke.mjs",
    "scripts/browser-smoke-runtime.mjs",
    "scripts/browser-smoke-dev-server.mjs",
    "scripts/browser-smoke-dev-server-log.mjs",
    "scripts/browser-smoke-dev-server-process.mjs",
    "scripts/browser-smoke-dev-server-stop.mjs",
    "scripts/browser-smoke-network.mjs",
    "scripts/browser-smoke-browser-launch.mjs",
    "scripts/browser-smoke-fixture.mjs",
    "scripts/browser-smoke-preflight.mjs",
    "scripts/browser-smoke-preflight-routes.mjs",
    "scripts/browser-smoke-auth-flow.mjs",
    "scripts/browser-smoke-review-primary.mjs",
    "scripts/browser-smoke-review-submit.mjs",
    "scripts/browser-smoke-source-commit.mjs",
    "scripts/browser-smoke-audit-filter.mjs",
    "scripts/browser-smoke-review-diagnostics.mjs",
    "scripts/browser-smoke-admin-flow.mjs",
  ]) {
    assertExists(context, file);
  }
}

function assertExists({ assert, exists }, file) {
  assert(exists(file), `${file} must exist.`);
}
