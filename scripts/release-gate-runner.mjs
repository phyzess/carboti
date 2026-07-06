import { spawn } from "node:child_process";
import process from "node:process";

import { formatStep } from "./release-gate-plan.mjs";

export function hasAnyEnv(names) {
  return names.some((name) => Boolean(process.env[name]?.trim()));
}

export async function runReleaseGateSteps(steps) {
  for (const [command, ...args] of steps) {
    await run(command, args);
  }
}

export async function runOptionalInternalHealthChecks(target, config) {
  const internalUrl = firstEnv(config.internalUrlVars);
  if (!internalUrl) {
    console.log(`No internal Worker health URL configured for ${target}; skipping optional check.`);
    return;
  }

  await run("node", [
    "scripts/health-check.mjs",
    target,
    "--url",
    internalUrl,
    "--expect-env",
    target,
  ]);
}

function firstEnv(names) {
  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value) return value;
  }

  return null;
}

function run(command, args) {
  const executable = command === "vp" && process.platform === "win32" ? "vp.cmd" : command;
  console.log(`\n> ${formatStep([command, ...args])}`);

  return new Promise((resolve, reject) => {
    const child = spawn(executable, args, {
      cwd: process.cwd(),
      env: {
        ...process.env,
        CI: process.env.CI ?? "1",
      },
      stdio: "inherit",
    });

    child.on("error", reject);
    child.on("close", (code, signal) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(
        new Error(
          `${formatStep([command, ...args])} failed with code ${code ?? "none"} signal ${
            signal ?? "none"
          }.`,
        ),
      );
    });
  });
}
