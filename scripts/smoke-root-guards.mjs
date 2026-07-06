import {
  assertRootCommandGuards,
  assertRootSmokeScriptGuards,
} from "./smoke-root-command-guards.mjs";
import { assertRootDevGuards } from "./smoke-root-dev-guards.mjs";
import { assertRootToolchainGuards } from "./smoke-root-toolchain-guards.mjs";

export function assertRootSmokeSetupGuards(context) {
  assertRootToolchainGuards(context);
  assertRootDevGuards(context);
  assertRootNeutralityGuards(context);
  assertRootCommandGuards(context);
}

export { assertRootSmokeScriptGuards };

function assertRootNeutralityGuards(context) {
  const { assert } = context;

  assert(
    context.forbiddenBusinessTerms.every(
      (pattern) => !pattern.test(context.businessNeutralityText),
    ),
    "qitu core sources, examples, scripts, and architecture docs must stay free of downstream business vocabulary.",
  );
}
