import { assertKitDocsInventoryGuards } from "./smoke-kit-inventory-docs-guards.mjs";
import { assertKitRepoInventoryGuards } from "./smoke-kit-inventory-repo-guards.mjs";
import { assertKitRuntimeInventoryGuards } from "./smoke-kit-inventory-runtime-guards.mjs";
import { assertKitSmokeInventoryGuards } from "./smoke-kit-inventory-smoke-guards.mjs";

export function assertKitInventoryGuards(context) {
  assertKitRepoInventoryGuards(context);
  assertKitDocsInventoryGuards(context);
  assertKitSmokeInventoryGuards(context);
  assertKitRuntimeInventoryGuards(context);
}
