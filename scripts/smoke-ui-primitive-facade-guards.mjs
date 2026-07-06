import { assertUiPrimitiveDataFacadeGuards } from "./smoke-ui-primitive-data-facade-guards.mjs";
import { assertUiPrimitiveFormFacadeGuards } from "./smoke-ui-primitive-form-facade-guards.mjs";
import { assertUiPrimitiveOverlayFacadeGuards } from "./smoke-ui-primitive-overlay-facade-guards.mjs";

export function assertUiPrimitiveFacadeGuards(context) {
  assertUiPrimitiveOverlayFacadeGuards(context);
  assertUiPrimitiveFormFacadeGuards(context);
  assertUiPrimitiveDataFacadeGuards(context);
}
