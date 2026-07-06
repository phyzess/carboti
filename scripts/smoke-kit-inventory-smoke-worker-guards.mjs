export function assertKitSmokeWorkerInventoryGuards(context) {
  const { assert, exists } = context;

  assert(
    exists("scripts/smoke-worker-auth-guards.mjs"),
    "scripts/smoke-worker-auth-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-worker-advisory-guards.mjs"),
    "scripts/smoke-worker-advisory-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-worker-import-review-guards.mjs"),
    "scripts/smoke-worker-import-review-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-worker-runtime-guards.mjs"),
    "scripts/smoke-worker-runtime-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-worker-schema-guards.mjs"),
    "scripts/smoke-worker-schema-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-worker-source-guards.mjs"),
    "scripts/smoke-worker-source-guards.mjs must exist.",
  );
}
