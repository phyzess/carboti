import { spawn } from "node:child_process";
import process from "node:process";

export function spawnBrowserSmokeDevServer({
  root,
  webPort,
  webUrl,
  workerPort,
  workerUrl,
  env = process.env,
  platform = process.platform,
}) {
  const vp = platform === "win32" ? "vp.cmd" : "vp";

  return spawn(vp, ["run", "dev:all"], {
    cwd: root,
    env: {
      ...env,
      CI: "1",
      QITU_PUBLIC_APP_URL: webUrl,
      QITU_WEB_PORT: webPort,
      QITU_WORKER_ORIGIN: workerUrl,
      QITU_WORKER_PORT: workerPort,
    },
    shell: false,
    stdio: ["ignore", "pipe", "pipe"],
  });
}
