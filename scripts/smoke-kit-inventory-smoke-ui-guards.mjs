export function assertKitSmokeUiInventoryGuards(context) {
  const { assert, exists } = context;

  assert(exists("scripts/smoke-ui-guards.mjs"), "scripts/smoke-ui-guards.mjs must exist.");
  assert(
    exists("scripts/smoke-ui-app-usage-guards.mjs"),
    "scripts/smoke-ui-app-usage-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-ui-primitive-guards.mjs"),
    "scripts/smoke-ui-primitive-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-ui-primitive-composition-guards.mjs"),
    "scripts/smoke-ui-primitive-composition-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-ui-primitive-facade-guards.mjs"),
    "scripts/smoke-ui-primitive-facade-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-ui-primitive-data-facade-guards.mjs"),
    "scripts/smoke-ui-primitive-data-facade-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-ui-primitive-form-facade-guards.mjs"),
    "scripts/smoke-ui-primitive-form-facade-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-ui-primitive-overlay-facade-guards.mjs"),
    "scripts/smoke-ui-primitive-overlay-facade-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-ui-primitive-inventory-guards.mjs"),
    "scripts/smoke-ui-primitive-inventory-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-ui-registry-guards.mjs"),
    "scripts/smoke-ui-registry-guards.mjs must exist.",
  );
  assert(
    exists("scripts/smoke-ui-token-guards.mjs"),
    "scripts/smoke-ui-token-guards.mjs must exist.",
  );
}
