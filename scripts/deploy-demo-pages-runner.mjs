import { spawn } from "node:child_process";
import process from "node:process";

export async function runDemoPagesDeploy({ cwd = process.cwd(), env = process.env, options }) {
  await run("vp", ["run", "build:demo"], {
    cwd,
    env: {
      ...env,
      VITE_QITU_API_MODE: "mock",
    },
  });
  await run("wrangler", ["whoami"], { cwd, env });
  await run(
    "wrangler",
    [
      "pages",
      "deploy",
      "apps/web/dist",
      "--project-name",
      options.projectName,
      "--branch",
      options.branch,
      "--commit-dirty=true",
    ],
    { cwd, env },
  );
}

function run(command, args, options = {}) {
  console.log(`\n> ${[command, ...args].join(" ")}`);

  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd ?? process.cwd(),
      env: options.env ?? process.env,
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
          `${[command, ...args].join(" ")} failed with code ${code ?? "none"} signal ${
            signal ?? "none"
          }.`,
        ),
      );
    });
  });
}
