import { assertRuntimeAppInventoryGuards } from "./smoke-kit-inventory-runtime-app-guards.mjs";
import { assertRuntimeBrowserSmokeInventoryGuards } from "./smoke-kit-inventory-runtime-browser-guards.mjs";
import { assertRuntimeCoreInventoryGuards } from "./smoke-kit-inventory-runtime-core-guards.mjs";
import { assertRuntimeOperationsInventoryGuards } from "./smoke-kit-inventory-runtime-operations-guards.mjs";
import { assertRuntimeWorkerIntegrationInventoryGuards } from "./smoke-kit-inventory-runtime-worker-integration-guards.mjs";

export function assertKitRuntimeInventoryGuards(context) {
  assertRuntimeCoreInventoryGuards(context);
  assertRuntimeWorkerIntegrationInventoryGuards(context);
  assertRuntimeBrowserSmokeInventoryGuards(context);
  assertRuntimeOperationsInventoryGuards(context);
  assertRuntimeAppInventoryGuards(context);
}
