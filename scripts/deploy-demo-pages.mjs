import process from "node:process";

import { parseDemoDeployArgs } from "./deploy-demo-pages-args.mjs";
import { printDemoDeploySummary } from "./deploy-demo-pages-output.mjs";
import { runDemoPagesDeploy } from "./deploy-demo-pages-runner.mjs";

try {
  const options = parseDemoDeployArgs(process.argv.slice(2));
  printDemoDeploySummary(options);
  await runDemoPagesDeploy({ options });
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
