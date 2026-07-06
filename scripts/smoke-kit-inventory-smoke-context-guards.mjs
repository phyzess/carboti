export function assertKitSmokeContextInventoryGuards(context) {
  const { assert, exists } = context;

  assert(
    exists("scripts/smoke-coverage-guards.mjs"),
    "scripts/smoke-coverage-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-coverage-browser-guards.mjs"),
    "scripts/smoke-coverage-browser-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-coverage-i18n-guards.mjs"),
    "scripts/smoke-coverage-i18n-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-coverage-package-interface-guards.mjs"),
    "scripts/smoke-coverage-package-interface-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-coverage-worker-integration-guards.mjs"),
    "scripts/smoke-coverage-worker-integration-guards.mjs must exist.",
  );
  assert(exists("scripts/smoke-context.mjs"), "scripts/smoke-context.mjs must exist.");
  assert(exists("scripts/smoke-context-docs.mjs"), "scripts/smoke-context-docs.mjs must exist.");
  assert(
    exists("scripts/smoke-context-helpers.mjs"),
    "scripts/smoke-context-helpers.mjs must exist.",
  );
  assert(exists("scripts/smoke-context-io.mjs"), "scripts/smoke-context-io.mjs must exist.");
  assert(
    exists("scripts/smoke-context-neutrality.mjs"),
    "scripts/smoke-context-neutrality.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-context-package.mjs"),
    "scripts/smoke-context-package.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-context-scripts.mjs"),
    "scripts/smoke-context-scripts.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-context-adoption-scripts.mjs"),
    "scripts/smoke-context-adoption-scripts.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-context-browser-scripts.mjs"),
    "scripts/smoke-context-browser-scripts.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-context-check-scripts.mjs"),
    "scripts/smoke-context-check-scripts.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-context-operations-scripts.mjs"),
    "scripts/smoke-context-operations-scripts.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-context-runtime-scripts.mjs"),
    "scripts/smoke-context-runtime-scripts.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-context-worker-integration-scripts.mjs"),
    "scripts/smoke-context-worker-integration-scripts.mjs must exist.",
  );
  assert(exists("scripts/smoke-context-web.mjs"), "scripts/smoke-context-web.mjs must exist.");
  assert(
    exists("scripts/smoke-context-web-mock-api.mjs"),
    "scripts/smoke-context-web-mock-api.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-context-web-review.mjs"),
    "scripts/smoke-context-web-review.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-context-web-runtime.mjs"),
    "scripts/smoke-context-web-runtime.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-context-web-shell.mjs"),
    "scripts/smoke-context-web-shell.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-context-web-workspace.mjs"),
    "scripts/smoke-context-web-workspace.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-context-worker.mjs"),
    "scripts/smoke-context-worker.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-context-worker-advisory.mjs"),
    "scripts/smoke-context-worker-advisory.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-context-worker-auth.mjs"),
    "scripts/smoke-context-worker-auth.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-context-worker-import.mjs"),
    "scripts/smoke-context-worker-import.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-context-worker-inbound.mjs"),
    "scripts/smoke-context-worker-inbound.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-context-worker-runtime.mjs"),
    "scripts/smoke-context-worker-runtime.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-context-worker-source.mjs"),
    "scripts/smoke-context-worker-source.mjs must exist.",
  );
}
