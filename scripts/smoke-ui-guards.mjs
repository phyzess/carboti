import { assertUiAppUsageGuards } from "./smoke-ui-app-usage-guards.mjs";
import { assertUiPrimitiveGuards } from "./smoke-ui-primitive-guards.mjs";
import { assertUiRegistryGuards } from "./smoke-ui-registry-guards.mjs";
import { assertUiTokenGuards } from "./smoke-ui-token-guards.mjs";

export function assertUiGuards(context) {
  assertUiRegistryGuards(context);
  assertUiPrimitiveGuards(context);
  assertUiAppUsageGuards(context);
  assertUiTokenGuards(context);
}
