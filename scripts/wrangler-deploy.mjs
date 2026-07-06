import process from "node:process";

import {
  hasDryRunArg,
  wranglerDeployTimeoutMs,
  wranglerWhoamiTimeoutMs,
} from "./wrangler-deploy-config.mjs";
import { runWrangler } from "./wrangler-deploy-runner.mjs";
import { findWorkerVersionId } from "./wrangler-deploy-version.mjs";

const passthroughArgs = process.argv.slice(2);

if (hasDryRunArg(passthroughArgs)) {
  console.error("Use scripts/wrangler-deploy-dry-run.mjs for dry-run deployments.");
  process.exit(1);
}

try {
  await runWrangler(["whoami"], wranglerWhoamiTimeoutMs());
  const output = await runWrangler(["deploy", ...passthroughArgs], wranglerDeployTimeoutMs());
  const versionId = findWorkerVersionId(output);
  if (!versionId) {
    throw new Error("Wrangler deploy succeeded, but no Worker version id was found in output.");
  }

  console.log(`Worker version id: ${versionId}`);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
