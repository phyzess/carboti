import { spawn } from "node:child_process";
import process from "node:process";

export function runObservedWranglerProcess({
  args,
  collectOutput = false,
  cwd,
  errorPrefix,
  startErrorMessage = (error) => `Failed to start Wrangler: ${error.message}`,
  successMarkers = [],
  successSettleMs = 250,
  timeoutMessage,
  timeoutMs,
}) {
  return new Promise((resolve, reject) => {
    const child = spawn(wranglerCommand(), args, {
      cwd,
      env: {
        ...process.env,
        CI: process.env.CI ?? "1",
      },
      stdio: ["ignore", "pipe", "pipe"],
    });

    const markers = normalizeSuccessMarkers(successMarkers);
    let output = "";
    let sawSuccessMarker = false;
    let settled = false;

    const timeout = setTimeout(() => {
      finish(new Error(timeoutMessage));
    }, timeoutMs);

    child.stdout.on("data", (chunk) => {
      handleOutput(chunk, process.stdout);
    });

    child.stderr.on("data", (chunk) => {
      handleOutput(chunk, process.stderr);
    });

    child.on("error", (error) => {
      finish(new Error(startErrorMessage(error)));
    });

    child.on("close", (code, signal) => {
      if (settled) return;
      if (code === 0 || sawSuccessMarker) {
        finish();
        return;
      }

      finish(
        new Error(`${errorPrefix} exited with code ${code ?? "none"} signal ${signal ?? "none"}.`),
      );
    });

    function handleOutput(chunk, stream) {
      const text = String(chunk);
      if (collectOutput) {
        output += text;
      }
      stream.write(chunk);
      observe(text);
    }

    function observe(text) {
      if (markers.some((marker) => text.includes(marker))) {
        sawSuccessMarker = true;
        setTimeout(() => finish(), successSettleMs);
      }
    }

    function finish(error) {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);

      if (child.exitCode === null && !child.killed) {
        child.kill("SIGTERM");
      }

      setTimeout(() => {
        if (error) {
          reject(error);
          return;
        }

        resolve(output);
      }, 25);
    }
  });
}

function wranglerCommand() {
  return process.platform === "win32" ? "wrangler.cmd" : "wrangler";
}

function normalizeSuccessMarkers(markers) {
  if (!markers) {
    return [];
  }

  return Array.isArray(markers) ? markers.filter(Boolean) : [markers];
}
