import { runObservedWranglerProcess } from "./wrangler-observed-process.mjs";

export async function runWrangler(args, commandTimeoutMs) {
  return runObservedWranglerProcess({
    args,
    collectOutput: true,
    errorPrefix: `Wrangler ${args[0]}`,
    timeoutMessage: `Wrangler ${args[0]} did not finish within ${commandTimeoutMs}ms.`,
    timeoutMs: commandTimeoutMs,
  });
}
