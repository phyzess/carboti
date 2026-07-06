import process from "node:process";

import {
  buildWranglerDryRunArgs,
  requiresCloudflareAccount,
  wranglerDryRunTimeoutMs,
  wranglerWhoamiTimeoutMs,
} from "./wrangler-deploy-dry-run-config.mjs";
import { runWranglerDryRun, runWranglerWhoami } from "./wrangler-deploy-dry-run-runner.mjs";

const passthroughArgs = process.argv.slice(2);

try {
  if (requiresCloudflareAccount(passthroughArgs)) {
    await runWranglerWhoami({ timeoutMs: wranglerWhoamiTimeoutMs() });
  }

  await runWranglerDryRun({
    timeoutMs: wranglerDryRunTimeoutMs(),
    wranglerArgs: buildWranglerDryRunArgs(passthroughArgs),
  });
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
