export function assertKitSmokeOperationsInventoryGuards(context) {
  const { assert, exists } = context;

  assert(
    exists("scripts/smoke-operations-guards.mjs"),
    "scripts/smoke-operations-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-operations-release-guards.mjs"),
    "scripts/smoke-operations-release-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-operations-deploy-preflight-guards.mjs"),
    "scripts/smoke-operations-deploy-preflight-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-operations-deploy-script-guards.mjs"),
    "scripts/smoke-operations-deploy-script-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-operations-health-guards.mjs"),
    "scripts/smoke-operations-health-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-operations-release-gate-guards.mjs"),
    "scripts/smoke-operations-release-gate-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-operations-recovery-guards.mjs"),
    "scripts/smoke-operations-recovery-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-operations-wrangler-guards.mjs"),
    "scripts/smoke-operations-wrangler-guards.mjs must exist.",
  );
}
