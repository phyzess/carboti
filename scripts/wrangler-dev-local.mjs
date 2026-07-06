import { spawn } from "node:child_process";
import process from "node:process";

const wrangler = process.platform === "win32" ? "wrangler.cmd" : "wrangler";
const port = process.env.QITU_WORKER_PORT ?? "8787";
const publicAppUrl = process.env.QITU_PUBLIC_APP_URL;

if (!/^\d+$/.test(port)) {
  console.error(`QITU_WORKER_PORT must be a numeric TCP port, received ${JSON.stringify(port)}.`);
  process.exit(1);
}

const args = ["dev", "--local", "--port", port];
if (publicAppUrl) {
  args.push("--var", `PUBLIC_APP_URL:${publicAppUrl}`);
}

const child = spawn(wrangler, args, {
  cwd: process.cwd(),
  env: process.env,
  stdio: "inherit",
  shell: false,
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
