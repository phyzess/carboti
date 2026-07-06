import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const workerDir = join(root, "apps", "worker");
const wrangler = process.platform === "win32" ? "wrangler.cmd" : "wrangler";
const successMarker = "Types written to worker-configuration.d.ts";
const timeoutMs = 120_000;
let markerSeen = false;
let settled = false;
let gracefulKillTimer = null;

const child = spawn(wrangler, ["types"], {
  cwd: workerDir,
  env: process.env,
  stdio: ["ignore", "pipe", "pipe"],
  shell: false,
});

const timeout = setTimeout(() => {
  if (settled) return;
  settled = true;
  child.kill("SIGTERM");
  console.error(`wrangler types did not finish within ${timeoutMs}ms.`);
  process.exitCode = 1;
}, timeoutMs);

child.stdout.on("data", (chunk) => handleOutput(chunk, process.stdout));
child.stderr.on("data", (chunk) => handleOutput(chunk, process.stderr));

child.on("error", (error) => {
  if (settled) return;
  settled = true;
  clearTimeout(timeout);
  console.error(error.message);
  process.exitCode = 1;
});

child.on("close", (code, signal) => {
  if (gracefulKillTimer) clearTimeout(gracefulKillTimer);
  clearTimeout(timeout);

  if (markerSeen) {
    process.exitCode = 0;
    return;
  }

  if (code === 0) {
    process.exitCode = 0;
    return;
  }

  process.exitCode = code ?? 1;
  if (signal) {
    console.error(`wrangler types exited with signal ${signal}.`);
  }
});

function handleOutput(chunk, stream) {
  const text = chunk.toString();
  stream.write(chunk);

  if (!markerSeen && text.includes(successMarker)) {
    markerSeen = true;
    gracefulKillTimer = setTimeout(() => {
      if (child.exitCode === null && !child.killed) {
        child.kill("SIGTERM");
      }
    }, 1_000);
  }
}
