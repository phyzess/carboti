import { assertUiPrimitiveCompositionGuards } from "./smoke-ui-primitive-composition-guards.mjs";
import { assertUiPrimitiveFacadeGuards } from "./smoke-ui-primitive-facade-guards.mjs";
import { assertUiPrimitiveInventoryGuards } from "./smoke-ui-primitive-inventory-guards.mjs";

export function assertUiPrimitiveGuards(context) {
  assertUiPrimitiveInventoryGuards(context);
  assertUiPrimitiveFacadeGuards(context);
  assertUiPrimitiveCompositionGuards(context);
}
