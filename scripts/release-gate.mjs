import process from "node:process";

import { parseReleaseGateArgs } from "./release-gate-args.mjs";
import { releaseTargets } from "./release-gate-config.mjs";
import { printReleaseGatePlan, withFailedJobLimit } from "./release-gate-plan.mjs";
import {
  hasAnyEnv,
  runOptionalInternalHealthChecks,
  runReleaseGateSteps,
} from "./release-gate-runner.mjs";

const options = parseReleaseGateArgs(process.argv.slice(2));
const config = releaseTargets[options.target];

if (!config) {
  fail(`Unknown release target "${options.target}". Use preview or production.`);
}

const steps = withFailedJobLimit(config.steps, options.failedJobLimit);

printReleaseGatePlan({ config, steps, target: options.target });

if (!options.execute) {
  console.log(`Plan only. Re-run with --yes to execute the ${options.target} release gate.`);
  process.exit(0);
}

if (!hasAnyEnv(config.appUrlVars)) {
  fail(
    `Missing deployed app URL for ${options.target}. Set one of: ${config.appUrlVars.join(", ")}.`,
  );
}

try {
  await runReleaseGateSteps(steps);
  await runOptionalInternalHealthChecks(options.target, config);
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}

console.log(`Release gate completed for ${options.target}.`);

function fail(message) {
  console.error(message);
  process.exit(1);
}
