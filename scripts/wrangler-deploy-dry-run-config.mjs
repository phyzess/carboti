import process from "node:process";

export const dryRunSuccessMarker = "--dry-run: exiting now.";

export function buildWranglerDryRunArgs(passthroughArgs) {
  const wranglerArgs = ["deploy", ...passthroughArgs];

  if (!wranglerArgs.includes("--dry-run")) {
    wranglerArgs.push("--dry-run");
  }

  return wranglerArgs;
}

export function requiresCloudflareAccount(args) {
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--env") {
      return args[index + 1] === "preview" || args[index + 1] === "production";
    }

    if (arg === "--env=preview" || arg === "--env=production") {
      return true;
    }
  }

  return false;
}

export function wranglerDryRunTimeoutMs() {
  return Number(process.env.WRANGLER_DRY_RUN_TIMEOUT_MS ?? 180_000);
}

export function wranglerWhoamiTimeoutMs() {
  return Number(process.env.WRANGLER_WHOAMI_TIMEOUT_MS ?? 60_000);
}
