import process from "node:process";

export function hasDryRunArg(args) {
  return args.includes("--dry-run");
}

export function wranglerDeployTimeoutMs() {
  return Number(process.env.WRANGLER_DEPLOY_TIMEOUT_MS ?? 300_000);
}

export function wranglerWhoamiTimeoutMs() {
  return Number(process.env.WRANGLER_WHOAMI_TIMEOUT_MS ?? 60_000);
}
