import process from "node:process";

export const failedJobsTargets = {
  local: {
    database: "carboti-dev",
    args: ["--local"],
  },
  preview: {
    database: "carboti-preview",
    args: ["--env", "preview", "--remote"],
  },
  production: {
    database: "carboti-production",
    args: ["--env", "production", "--remote"],
  },
};

export function parseFailedJobsArgs(args) {
  let target = "local";
  let limit = 25;

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (!arg) continue;

    if (arg === "--limit") {
      limit = parseFailedJobsLimit(args[index + 1]);
      index += 1;
      continue;
    }

    if (arg.startsWith("--limit=")) {
      limit = parseFailedJobsLimit(arg.slice("--limit=".length));
      continue;
    }

    if (!arg.startsWith("-")) {
      target = arg;
    }
  }

  return {
    target,
    limit,
  };
}

export function parseFailedJobsLimit(value) {
  const parsed = Number.parseInt(value ?? "", 10);
  if (!Number.isInteger(parsed) || parsed < 1) {
    return 25;
  }

  return Math.min(parsed, 100);
}

export function failedJobsTimeoutMs() {
  return Number(process.env.WRANGLER_D1_EXECUTE_TIMEOUT_MS ?? 180_000);
}
