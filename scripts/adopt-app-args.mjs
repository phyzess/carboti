import { existsSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";

export function createAdoptionOptions(argv, root = process.cwd()) {
  const args = parseArgs(argv);
  const appName = stringArg(args, "name");
  const namespace = args.namespace ?? `@${appName}`;

  validateAppName(appName);
  validateNamespace(namespace);

  return {
    appName,
    appTitle: args["app-title"] ?? appName,
    apply: Boolean(args.apply),
    cleanProductBaseline: Boolean(args["clean-product-baseline"]),
    cookieName: args["cookie-name"] ?? `${appName}_session`,
    exists: (path) => existsSync(join(root, path)),
    namespace,
    upstreamRemote: args["upstream-remote"] ?? "qitu-template",
    workerName: args["worker-name"] ?? `${appName}-worker`,
  };
}

function parseArgs(argv) {
  const parsed = {};

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg?.startsWith("--")) {
      fail(`Unexpected argument: ${arg}`);
    }

    const key = arg.slice(2);
    if (key === "apply" || key === "clean-product-baseline") {
      parsed[key] = true;
      continue;
    }

    const value = argv[index + 1];
    if (!value || value.startsWith("--")) {
      fail(`Missing value for --${key}.`);
    }
    parsed[key] = value;
    index += 1;
  }

  return parsed;
}

function stringArg(args, name) {
  const value = args[name];
  if (!value) {
    fail(`Pass --${name} for the adopted application identity.`);
  }
  return value;
}

function validateAppName(value) {
  if (!/^[a-z][a-z0-9-]*$/.test(value)) {
    fail("--name must be lowercase kebab-case, for example: internal-tool");
  }
}

function validateNamespace(value) {
  if (!/^@[a-z][a-z0-9-]*(?:-[a-z0-9]+)*$/.test(value)) {
    fail("--namespace must be a scoped package namespace, for example: @internal-tool");
  }
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
