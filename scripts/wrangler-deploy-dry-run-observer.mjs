import { runObservedWranglerProcess } from "./wrangler-observed-process.mjs";

export function runWranglerObserved({
  args,
  errorPrefix,
  successMarker,
  timeoutMessage,
  timeoutMs,
}) {
  return runObservedWranglerProcess({
    args,
    errorPrefix,
    successMarkers: successMarker ? [successMarker] : [],
    timeoutMessage,
    timeoutMs,
  });
}
