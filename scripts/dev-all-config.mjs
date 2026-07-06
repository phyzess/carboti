import process from "node:process";

import { findOpenPort } from "./dev-all-ports.mjs";

export async function resolveDevAllConfig(env = process.env, platform = process.platform) {
  const webPort = env.QITU_WEB_PORT ?? (await findOpenPort());
  const workerPort = env.QITU_WORKER_PORT ?? (await findOpenPort(new Set([webPort])));
  const workerOrigin = env.QITU_WORKER_ORIGIN ?? `http://127.0.0.1:${workerPort}`;
  const publicAppUrl =
    env.QITU_PUBLIC_APP_URL ?? env.PUBLIC_APP_URL ?? `http://localhost:${webPort}`;

  return {
    commands: [
      { name: "web", args: ["run", "--filter", "@carboti/web", "dev"] },
      { name: "worker", args: ["run", "--filter", "@carboti/worker", "dev"] },
    ],
    publicAppUrl,
    sharedEnv: {
      ...env,
      PUBLIC_APP_URL: env.PUBLIC_APP_URL ?? publicAppUrl,
      QITU_PUBLIC_APP_URL: publicAppUrl,
      QITU_WEB_PORT: webPort,
      QITU_WORKER_ORIGIN: workerOrigin,
      QITU_WORKER_PORT: workerPort,
    },
    vp: platform === "win32" ? "vp.cmd" : "vp",
    webPort,
    workerOrigin,
    workerPort,
  };
}
