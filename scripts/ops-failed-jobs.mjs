import process from "node:process";

import {
  failedJobsTargets,
  failedJobsTimeoutMs,
  parseFailedJobsArgs,
} from "./ops-failed-jobs-config.mjs";
import { buildFailedJobsQuery } from "./ops-failed-jobs-query.mjs";
import { runFailedJobsQuery } from "./ops-failed-jobs-runner.mjs";

const { target, limit } = parseFailedJobsArgs(process.argv.slice(2));
const config = failedJobsTargets[target];

if (!config) {
  fail(`Unknown target "${target}". Use local, preview, or production.`);
}

try {
  await runFailedJobsQuery({
    config,
    query: buildFailedJobsQuery(limit),
    root: process.cwd(),
    timeoutMs: failedJobsTimeoutMs(),
  });
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
