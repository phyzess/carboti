import { assertOperationsRecoveryGuards } from "./smoke-operations-recovery-guards.mjs";
import { assertOperationsReleaseGuards } from "./smoke-operations-release-guards.mjs";
import { assertOperationsWranglerGuards } from "./smoke-operations-wrangler-guards.mjs";

export function assertOperationsGuards(context) {
  assertOperationsReleaseGuards(context);
  assertOperationsRecoveryGuards(context);
  assertOperationsWranglerGuards(context);
}
