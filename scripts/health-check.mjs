import process from "node:process";

import {
  healthCheckTimeoutMs,
  healthTargetConfigs,
  parseHealthCheckArgs,
} from "./health-check-config.mjs";
import { runHealthCheck } from "./health-check-runner.mjs";
import { resolveHealthCheckTarget } from "./health-check-url.mjs";

const options = parseHealthCheckArgs(process.argv.slice(2));
const config = healthTargetConfigs[options.target];

if (!config && !options.url) {
  fail(`Unknown health target "${options.target}". Use local, preview, production, or --url.`);
}

try {
  const { expectedEnvironment, healthUrl } = resolveHealthCheckTarget({ config, options });
  const body = await runHealthCheck({
    expectedEnvironment,
    healthUrl,
    timeoutMs: healthCheckTimeoutMs(),
  });

  console.log(
    `Health check passed: target=${options.target} environment=${body.environment} url=${healthUrl}`,
  );
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
