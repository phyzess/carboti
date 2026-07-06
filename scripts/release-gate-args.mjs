import process from "node:process";

export function parseReleaseGateArgs(args) {
  let target = null;
  let execute = false;
  let failedJobLimit = 50;

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (!arg) continue;

    if (arg === "--") {
      continue;
    }

    if (arg === "--yes" || arg === "--execute") {
      execute = true;
      continue;
    }

    if (arg === "--plan") {
      execute = false;
      continue;
    }

    if (arg === "--failed-job-limit") {
      failedJobLimit = parseLimit(args[index + 1]);
      index += 1;
      continue;
    }

    if (arg.startsWith("--failed-job-limit=")) {
      failedJobLimit = parseLimit(arg.slice("--failed-job-limit=".length));
      continue;
    }

    if (!arg.startsWith("-") && !target) {
      target = arg;
      continue;
    }

    fail(`Unknown release gate argument: ${arg}`);
  }

  return {
    execute,
    failedJobLimit,
    target: target ?? "preview",
  };
}

function parseLimit(value) {
  const parsed = Number.parseInt(value ?? "", 10);
  if (!Number.isInteger(parsed) || parsed < 1) {
    fail("--failed-job-limit must be a positive integer.");
  }

  return Math.min(parsed, 100);
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
