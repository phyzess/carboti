import process from "node:process";

export function parseDemoDeployArgs(args, env = process.env) {
  let projectName = env.QITU_DEMO_PAGES_PROJECT?.trim() || "qitu-demo";
  let branch = env.QITU_DEMO_PAGES_BRANCH?.trim() || "main";

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (!arg) continue;

    if (arg === "--") {
      continue;
    }

    if (arg === "--project-name") {
      projectName = requireValue(args[index + 1], "--project-name");
      index += 1;
      continue;
    }

    if (arg.startsWith("--project-name=")) {
      projectName = requireValue(arg.slice("--project-name=".length), "--project-name");
      continue;
    }

    if (arg === "--branch") {
      branch = requireValue(args[index + 1], "--branch");
      index += 1;
      continue;
    }

    if (arg.startsWith("--branch=")) {
      branch = requireValue(arg.slice("--branch=".length), "--branch");
      continue;
    }

    throw new Error(`Unknown demo deploy argument: ${arg}`);
  }

  return {
    branch,
    projectName,
  };
}

function requireValue(value, name) {
  const trimmed = value?.trim();
  if (!trimmed) {
    throw new Error(`${name} requires a non-empty value.`);
  }
  return trimmed;
}
