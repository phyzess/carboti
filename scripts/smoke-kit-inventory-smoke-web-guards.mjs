export function assertKitSmokeWebInventoryGuards(context) {
  const { assert, exists } = context;

  assert(exists("scripts/smoke-web-guards.mjs"), "scripts/smoke-web-guards.mjs must exist.");
  assert(
    exists("scripts/smoke-web-shell-guards.mjs"),
    "scripts/smoke-web-shell-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-web-shell-home-guards.mjs"),
    "scripts/smoke-web-shell-home-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-web-shell-inventory-guards.mjs"),
    "scripts/smoke-web-shell-inventory-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-web-shell-navigation-guards.mjs"),
    "scripts/smoke-web-shell-navigation-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-web-shell-route-guards.mjs"),
    "scripts/smoke-web-shell-route-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-web-shell-search-guards.mjs"),
    "scripts/smoke-web-shell-search-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-web-page-guards.mjs"),
    "scripts/smoke-web-page-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-web-audit-page-guards.mjs"),
    "scripts/smoke-web-audit-page-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-web-import-page-guards.mjs"),
    "scripts/smoke-web-import-page-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-web-page-inventory-guards.mjs"),
    "scripts/smoke-web-page-inventory-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-web-page-shared-guards.mjs"),
    "scripts/smoke-web-page-shared-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-web-source-page-guards.mjs"),
    "scripts/smoke-web-source-page-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-web-mock-api-guards.mjs"),
    "scripts/smoke-web-mock-api-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-web-mock-api-inventory-guards.mjs"),
    "scripts/smoke-web-mock-api-inventory-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-web-mock-api-model-guards.mjs"),
    "scripts/smoke-web-mock-api-model-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-web-mock-api-operation-guards.mjs"),
    "scripts/smoke-web-mock-api-operation-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-web-mock-api-seed-guards.mjs"),
    "scripts/smoke-web-mock-api-seed-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-web-workflow-guards.mjs"),
    "scripts/smoke-web-workflow-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-web-action-workflow-guards.mjs"),
    "scripts/smoke-web-action-workflow-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-web-action-auth-guards.mjs"),
    "scripts/smoke-web-action-auth-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-web-action-review-guards.mjs"),
    "scripts/smoke-web-action-review-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-web-action-workspace-guards.mjs"),
    "scripts/smoke-web-action-workspace-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-web-review-console-guards.mjs"),
    "scripts/smoke-web-review-console-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-web-top-level-composition-guards.mjs"),
    "scripts/smoke-web-top-level-composition-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-web-workflow-inventory-guards.mjs"),
    "scripts/smoke-web-workflow-inventory-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-web-runtime-guards.mjs"),
    "scripts/smoke-web-runtime-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-web-runtime-api-guards.mjs"),
    "scripts/smoke-web-runtime-api-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-web-runtime-auth-guards.mjs"),
    "scripts/smoke-web-runtime-auth-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-web-runtime-proxy-guards.mjs"),
    "scripts/smoke-web-runtime-proxy-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-web-runtime-surface-guards.mjs"),
    "scripts/smoke-web-runtime-surface-guards.mjs must exist.",
  );
}
