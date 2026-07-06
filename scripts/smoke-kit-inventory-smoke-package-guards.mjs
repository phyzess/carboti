export function assertKitSmokePackageInventoryGuards(context) {
  const { assert, exists } = context;

  assert(
    exists("scripts/smoke-package-contract-guards.mjs"),
    "scripts/smoke-package-contract-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-package-app-contract-guards.mjs"),
    "scripts/smoke-package-app-contract-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-package-core-contract-guards.mjs"),
    "scripts/smoke-package-core-contract-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-package-manifest-guards.mjs"),
    "scripts/smoke-package-manifest-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-package-manifest-env-guards.mjs"),
    "scripts/smoke-package-manifest-env-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-package-manifest-web-guards.mjs"),
    "scripts/smoke-package-manifest-web-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-package-manifest-worker-guards.mjs"),
    "scripts/smoke-package-manifest-worker-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-package-manifest-worker-script-guards.mjs"),
    "scripts/smoke-package-manifest-worker-script-guards.mjs must exist.",
  );
}
