import process from "node:process";

import { createDeployPreflightResult } from "./deploy-preflight-checks.mjs";
import { readWranglerConfig } from "./deploy-preflight-config.mjs";
import {
  printDeployPreflightFailure,
  printDeployPreflightSuccess,
  printDeployPreflightSummary,
  printDeployPreflightWarnings,
} from "./deploy-preflight-output.mjs";

const root = process.cwd();
const target = process.argv.slice(2).find((arg) => !arg.startsWith("-")) ?? "production";
const config = readWranglerConfig({ root });
const result = createDeployPreflightResult({ config, target });

if (!result.targetConfig) {
  fail(`Unknown deploy preflight target "${target}". Use local, preview, or production.`);
}

printDeployPreflightSummary(result);
printDeployPreflightWarnings(result);

if (result.errors.length > 0) {
  printDeployPreflightFailure(result);
  process.exit(1);
}

printDeployPreflightSuccess(result);

function fail(message) {
  console.error(message);
  process.exit(1);
}
