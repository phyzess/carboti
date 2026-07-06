import { createSmokeContext } from "./smoke-context.mjs";
import { assertCoverageGuards } from "./smoke-coverage-guards.mjs";
import { assertKitStructureGuards } from "./smoke-kit-structure-guards.mjs";
import { assertOperationsGuards } from "./smoke-operations-guards.mjs";
import { reportSmokeResult } from "./smoke-output.mjs";
import { assertPackageContractGuards } from "./smoke-package-contract-guards.mjs";
import { assertRootSmokeScriptGuards, assertRootSmokeSetupGuards } from "./smoke-root-guards.mjs";
import { assertUiGuards } from "./smoke-ui-guards.mjs";
import { assertWebCompositionGuards } from "./smoke-web-guards.mjs";
import { assertWebRuntimeGuards } from "./smoke-web-runtime-guards.mjs";
import { assertWorkerRuntimeGuards } from "./smoke-worker-runtime-guards.mjs";

export function runSmoke() {
  const failures = [];
  const assert = (condition, message) => {
    if (!condition) failures.push(message);
  };
  const context = createSmokeContext();
  const guardContext = { ...context, assert };

  assertRootSmokeSetupGuards(guardContext);
  assertWebCompositionGuards(guardContext);
  assertUiGuards(guardContext);
  assertRootSmokeScriptGuards(guardContext);
  assertOperationsGuards(guardContext);
  assertKitStructureGuards(guardContext);
  assertPackageContractGuards(guardContext);
  assertWorkerRuntimeGuards(guardContext);
  assertWebRuntimeGuards(guardContext);
  assertCoverageGuards(guardContext);

  reportSmokeResult(failures);
}
