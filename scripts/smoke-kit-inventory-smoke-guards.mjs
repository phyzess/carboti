import { assertKitSmokeContextInventoryGuards } from "./smoke-kit-inventory-smoke-context-guards.mjs";
import { assertKitSmokeKitInventoryGuards } from "./smoke-kit-inventory-smoke-kit-guards.mjs";
import { assertKitSmokeOperationsInventoryGuards } from "./smoke-kit-inventory-smoke-operations-guards.mjs";
import { assertKitSmokePackageInventoryGuards } from "./smoke-kit-inventory-smoke-package-guards.mjs";
import { assertKitSmokeUiInventoryGuards } from "./smoke-kit-inventory-smoke-ui-guards.mjs";
import { assertKitSmokeWebInventoryGuards } from "./smoke-kit-inventory-smoke-web-guards.mjs";
import { assertKitSmokeWorkerInventoryGuards } from "./smoke-kit-inventory-smoke-worker-guards.mjs";

export function assertKitSmokeInventoryGuards(context) {
  assertKitSmokeContextInventoryGuards(context);
  assertKitSmokeKitInventoryGuards(context);
  assertKitSmokeOperationsInventoryGuards(context);
  assertKitSmokePackageInventoryGuards(context);
  assertKitSmokeUiInventoryGuards(context);
  assertKitSmokeWebInventoryGuards(context);
  assertKitSmokeWorkerInventoryGuards(context);
}
