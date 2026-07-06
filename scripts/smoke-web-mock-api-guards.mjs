import { assertWebMockApiInventoryGuards } from "./smoke-web-mock-api-inventory-guards.mjs";
import { assertWebMockApiModelGuards } from "./smoke-web-mock-api-model-guards.mjs";
import { assertWebMockApiOperationGuards } from "./smoke-web-mock-api-operation-guards.mjs";
import { assertWebMockApiSeedGuards } from "./smoke-web-mock-api-seed-guards.mjs";

export function assertWebMockApiCompositionGuards(context) {
  assertWebMockApiInventoryGuards(context);
  assertWebMockApiModelGuards(context);
  assertWebMockApiSeedGuards(context);
  assertWebMockApiOperationGuards(context);
}
