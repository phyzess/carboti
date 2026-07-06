import { spawn } from "node:child_process";
import process from "node:process";
import readline from "node:readline";

export function runDevAll(config) {
  const children = [];
  let stopping = false;

  console.log(`qitu local dev: web http://localhost:${config.webPort}`);
  console.log(`qitu local dev: worker ${config.workerOrigin}`);

  const stopAll = (signal = "SIGTERM") => {
    if (stopping) return;
    stopping = true;
    for (const child of children) {
      if (!child.killed) child.kill(signal);
    }
  };

  for (const command of config.commands) {
    const child = spawn(config.vp, command.args, {
      cwd: process.cwd(),
      env: config.sharedEnv,
      shell: false,
      stdio: ["inherit", "pipe", "pipe"],
    });

    children.push(child);
    pipeWithPrefix(child.stdout, command.name, process.stdout);
    pipeWithPrefix(child.stderr, command.name, process.stderr);

    child.on("exit", (code, signal) => {
      if (stopping) return;
      if (code && code !== 0) {
        console.error(`[${command.name}] exited with code ${code}`);
        process.exitCode = code;
        stopAll();
        return;
      }
      if (signal) {
        console.error(`[${command.name}] exited by signal ${signal}`);
        process.exitCode = 1;
        stopAll();
      }
    });
  }

  process.on("SIGINT", () => stopAll("SIGINT"));
  process.on("SIGTERM", () => stopAll("SIGTERM"));
}

function pipeWithPrefix(stream, prefix, writer) {
  const rl = readline.createInterface({ input: stream });
  rl.on("line", (line) => writer.write(`[${prefix}] ${line}\n`));
}
