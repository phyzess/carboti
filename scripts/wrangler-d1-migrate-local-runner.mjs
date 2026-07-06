import { spawn } from "node:child_process";
import process from "node:process";

import { createLocalD1MigrationOutputTracker } from "./wrangler-d1-migrate-local-output.mjs";

export function runLocalD1Migration(config) {
  let settled = false;
  let gracefulKillTimer = null;
  const output = createLocalD1MigrationOutputTracker(config);
  const child = spawn(config.wrangler, config.args, {
    cwd: config.workerDir,
    env: config.env,
    shell: false,
    stdio: ["ignore", "pipe", "pipe"],
  });

  const timeout = setTimeout(() => {
    if (settled) return;
    settled = true;
    child.kill("SIGTERM");
    console.error(`wrangler local D1 migrations did not finish within ${config.timeoutMs}ms.`);
    process.exitCode = 1;
  }, config.timeoutMs);

  child.stdout.on("data", (chunk) => handleOutput(output, child, chunk, process.stdout));
  child.stderr.on("data", (chunk) => handleOutput(output, child, chunk, process.stderr));
  child.on("error", (error) =>
    handleError(
      error,
      timeout,
      () => settled,
      (value) => (settled = value),
    ),
  );
  child.on("close", (code, signal) => {
    if (gracefulKillTimer) clearTimeout(gracefulKillTimer);
    clearTimeout(timeout);

    if (output.markerSeen() || code === 0) {
      process.exitCode = 0;
      return;
    }

    process.exitCode = code ?? 1;
    if (signal) {
      console.error(`wrangler local D1 migrations exited with signal ${signal}.`);
    }
  });

  function handleOutput(tracker, childProcess, chunk, stream) {
    if (tracker.handleOutput(chunk, stream) && !gracefulKillTimer) {
      gracefulKillTimer = setTimeout(() => {
        if (childProcess.exitCode === null && !childProcess.killed) {
          childProcess.kill("SIGTERM");
        }
      }, 1_000);
    }
  }
}

function handleError(error, timeout, isSettled, setSettled) {
  if (isSettled()) return;
  setSettled(true);
  clearTimeout(timeout);
  console.error(error.message);
  process.exitCode = 1;
}
