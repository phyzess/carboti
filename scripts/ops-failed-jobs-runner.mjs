import { join } from "node:path";

import { runObservedWranglerProcess } from "./wrangler-observed-process.mjs";

const successMarkers = ['"success": true'];

export function runFailedJobsQuery({ config, query, root, timeoutMs }) {
  return runObservedWranglerProcess({
    args: ["d1", "execute", config.database, ...config.args, "--command", query],
    cwd: join(root, "apps", "worker"),
    errorPrefix: "Wrangler D1 query",
    startErrorMessage: (error) => error.message,
    successMarkers,
    timeoutMessage: `Wrangler D1 query did not finish within ${timeoutMs}ms.`,
    timeoutMs,
  });
}
