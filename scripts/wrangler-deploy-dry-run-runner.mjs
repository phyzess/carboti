import { dryRunSuccessMarker } from "./wrangler-deploy-dry-run-config.mjs";
import { runWranglerObserved } from "./wrangler-deploy-dry-run-observer.mjs";

export function runWranglerDryRun({ timeoutMs, wranglerArgs }) {
  return runWranglerObserved({
    args: wranglerArgs,
    errorPrefix: "Wrangler dry-run",
    successMarker: dryRunSuccessMarker,
    timeoutMessage: `Wrangler dry-run did not finish within ${timeoutMs}ms.`,
    timeoutMs,
  });
}

export function runWranglerWhoami({ timeoutMs }) {
  return runWranglerObserved({
    args: ["whoami"],
    errorPrefix: "Wrangler whoami",
    successMarker: null,
    timeoutMessage: `Wrangler whoami did not finish within ${timeoutMs}ms.`,
    timeoutMs,
  });
}
