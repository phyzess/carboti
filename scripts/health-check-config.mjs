import process from "node:process";

export const healthTargetConfigs = {
  local: {
    expectedEnvironment: "local",
    envVars: ["QITU_HEALTH_URL", "QITU_LOCAL_APP_URL", "QITU_PUBLIC_APP_URL"],
    fallbackUrl: "http://127.0.0.1:8787",
  },
  preview: {
    expectedEnvironment: "preview",
    envVars: ["QITU_HEALTH_URL", "QITU_PREVIEW_APP_URL", "QITU_PUBLIC_APP_URL"],
    fallbackUrl: null,
  },
  production: {
    expectedEnvironment: "production",
    envVars: ["QITU_HEALTH_URL", "QITU_PRODUCTION_APP_URL", "QITU_PUBLIC_APP_URL"],
    fallbackUrl: null,
  },
};

export function parseHealthCheckArgs(args) {
  let target = "local";
  let url = null;
  let expectedEnvironment = null;

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (!arg) continue;

    if (arg === "--url") {
      url = args[index + 1] ?? null;
      index += 1;
      continue;
    }

    if (arg.startsWith("--url=")) {
      url = arg.slice("--url=".length);
      continue;
    }

    if (arg === "--expect-env") {
      expectedEnvironment = args[index + 1] ?? null;
      index += 1;
      continue;
    }

    if (arg.startsWith("--expect-env=")) {
      expectedEnvironment = arg.slice("--expect-env=".length);
      continue;
    }

    if (!arg.startsWith("-")) {
      target = arg;
    }
  }

  if (/^https?:\/\//.test(target) && !url) {
    url = target;
    target = "custom";
  }

  return { expectedEnvironment, target, url };
}

export function healthCheckTimeoutMs() {
  return Number(process.env.QITU_HEALTH_TIMEOUT_MS ?? 15_000);
}
