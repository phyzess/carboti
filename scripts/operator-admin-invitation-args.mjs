export function parseArgs(args) {
  let target = "local";
  let email = null;
  let appUrl = null;
  let createdBy = null;
  let expiresDays = 1;
  let dryRun = false;

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (!arg) continue;

    if (arg === "--email") {
      email = args[index + 1] ?? null;
      index += 1;
      continue;
    }

    if (arg.startsWith("--email=")) {
      email = arg.slice("--email=".length);
      continue;
    }

    if (arg === "--app-url") {
      appUrl = args[index + 1] ?? null;
      index += 1;
      continue;
    }

    if (arg.startsWith("--app-url=")) {
      appUrl = arg.slice("--app-url=".length);
      continue;
    }

    if (arg === "--created-by") {
      createdBy = args[index + 1] ?? null;
      index += 1;
      continue;
    }

    if (arg.startsWith("--created-by=")) {
      createdBy = arg.slice("--created-by=".length);
      continue;
    }

    if (arg === "--expires-days") {
      expiresDays = parseExpiresDays(args[index + 1]);
      index += 1;
      continue;
    }

    if (arg.startsWith("--expires-days=")) {
      expiresDays = parseExpiresDays(arg.slice("--expires-days=".length));
      continue;
    }

    if (arg === "--dry-run") {
      dryRun = true;
      continue;
    }

    if (!arg.startsWith("-")) {
      target = arg;
    }
  }

  return {
    appUrl: appUrl?.trim() || null,
    createdBy: createdBy?.trim() || null,
    dryRun,
    email: email?.trim() || null,
    expiresDays,
    target,
  };
}

function parseExpiresDays(value) {
  const parsed = Number.parseInt(value ?? "", 10);
  if (!Number.isInteger(parsed) || parsed < 1) {
    return 1;
  }

  return Math.min(parsed, 30);
}
