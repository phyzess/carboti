import { createBrowserSmokeDevServerLog } from "./browser-smoke-dev-server-log.mjs";
import { spawnBrowserSmokeDevServer } from "./browser-smoke-dev-server-process.mjs";
import { createBrowserSmokeDevServerStopper } from "./browser-smoke-dev-server-stop.mjs";

export function startBrowserSmokeDevServer(options) {
  const serverLog = createBrowserSmokeDevServerLog();
  const server = spawnBrowserSmokeDevServer(options);
  const stopper = createBrowserSmokeDevServerStopper(server);

  server.stdout.on("data", (chunk) => serverLog.rememberLog(chunk));
  server.stderr.on("data", (chunk) => serverLog.rememberLog(chunk));
  server.on("exit", (code, signal) => {
    if (stopper.isStopping()) {
      return;
    }
    if (code !== null && code !== 0) {
      console.error(`dev:all exited with code ${code}.`);
      serverLog.dumpServerLog();
    }
    if (signal) {
      console.error(`dev:all exited with signal ${signal}.`);
      serverLog.dumpServerLog();
    }
  });

  return {
    dumpServerLog: () => serverLog.dumpServerLog(),
    stopServer: () => stopper.stopServer(),
  };
}
