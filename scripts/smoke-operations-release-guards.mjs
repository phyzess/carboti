import { assertOperationsDeployPreflightGuards } from "./smoke-operations-deploy-preflight-guards.mjs";
import { assertOperationsDeployScriptGuards } from "./smoke-operations-deploy-script-guards.mjs";
import { assertOperationsHealthGuards } from "./smoke-operations-health-guards.mjs";
import { assertOperationsReleaseGateGuards } from "./smoke-operations-release-gate-guards.mjs";

export function assertOperationsReleaseGuards(context) {
  assertOperationsDeployScriptGuards(context);
  assertOperationsDeployPreflightGuards(context);
  assertOperationsReleaseGateGuards(context);
  assertOperationsHealthGuards(context);
}
