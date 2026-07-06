export function assertKitSmokeKitInventoryGuards(context) {
  const { assert, exists } = context;

  assert(exists("scripts/smoke.mjs"), "scripts/smoke.mjs must exist.");
  assert(exists("scripts/smoke-runner.mjs"), "scripts/smoke-runner.mjs must exist.");
  assert(exists("scripts/smoke-root-guards.mjs"), "scripts/smoke-root-guards.mjs must exist.");
  assert(
    exists("scripts/smoke-root-command-guards.mjs"),
    "scripts/smoke-root-command-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-root-dev-guards.mjs"),
    "scripts/smoke-root-dev-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-root-toolchain-guards.mjs"),
    "scripts/smoke-root-toolchain-guards.mjs must exist.",
  );
  assert(exists("scripts/smoke-output.mjs"), "scripts/smoke-output.mjs must exist.");
  assert(
    exists("scripts/smoke-kit-structure-guards.mjs"),
    "scripts/smoke-kit-structure-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-kit-documentation-guards.mjs"),
    "scripts/smoke-kit-documentation-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-kit-inventory-guards.mjs"),
    "scripts/smoke-kit-inventory-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-kit-inventory-docs-guards.mjs"),
    "scripts/smoke-kit-inventory-docs-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-kit-inventory-repo-guards.mjs"),
    "scripts/smoke-kit-inventory-repo-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-kit-inventory-runtime-guards.mjs"),
    "scripts/smoke-kit-inventory-runtime-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-kit-inventory-runtime-app-guards.mjs"),
    "scripts/smoke-kit-inventory-runtime-app-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-kit-inventory-runtime-browser-guards.mjs"),
    "scripts/smoke-kit-inventory-runtime-browser-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-kit-inventory-runtime-core-guards.mjs"),
    "scripts/smoke-kit-inventory-runtime-core-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-kit-inventory-runtime-operations-guards.mjs"),
    "scripts/smoke-kit-inventory-runtime-operations-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-kit-inventory-runtime-worker-integration-guards.mjs"),
    "scripts/smoke-kit-inventory-runtime-worker-integration-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-kit-inventory-smoke-guards.mjs"),
    "scripts/smoke-kit-inventory-smoke-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-kit-inventory-smoke-context-guards.mjs"),
    "scripts/smoke-kit-inventory-smoke-context-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-kit-inventory-smoke-kit-guards.mjs"),
    "scripts/smoke-kit-inventory-smoke-kit-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-kit-inventory-smoke-operations-guards.mjs"),
    "scripts/smoke-kit-inventory-smoke-operations-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-kit-inventory-smoke-package-guards.mjs"),
    "scripts/smoke-kit-inventory-smoke-package-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-kit-inventory-smoke-ui-guards.mjs"),
    "scripts/smoke-kit-inventory-smoke-ui-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-kit-inventory-smoke-web-guards.mjs"),
    "scripts/smoke-kit-inventory-smoke-web-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-kit-inventory-smoke-worker-guards.mjs"),
    "scripts/smoke-kit-inventory-smoke-worker-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-kit-package-example-guards.mjs"),
    "scripts/smoke-kit-package-example-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-kit-template-guards.mjs"),
    "scripts/smoke-kit-template-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-kit-toolchain-guards.mjs"),
    "scripts/smoke-kit-toolchain-guards.mjs must exist.",
  );
}
