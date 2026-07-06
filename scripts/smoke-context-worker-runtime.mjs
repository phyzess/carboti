export function createSmokeWorkerRuntimeContext({ sourceTextUnder, text }) {
  return {
    workerDevVarsExample: text("apps/worker/.dev.vars.example"),
    workerPackage: JSON.parse(text("apps/worker/package.json")),
    workerPackageJson: JSON.parse(text("apps/worker/package.json")),
    workerSources: sourceTextUnder("apps/worker/src"),
    wranglerConfig: text("apps/worker/wrangler.jsonc"),
  };
}
