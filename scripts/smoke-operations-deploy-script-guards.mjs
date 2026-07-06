export function assertOperationsDeployScriptGuards(context) {
  const {
    assert,
    deployDemoPages,
    exists,
    packageJson,
    workerPackageJson,
    wranglerDeployDryRunScript,
    wranglerDeployScript,
  } = context;

  assert(
    packageJson.scripts["deploy:demo"].includes("deploy-demo-pages.mjs") &&
      packageJson.scripts["build:demo"].includes("@carboti/web") &&
      deployDemoPages.includes("VITE_QITU_API_MODE") &&
      deployDemoPages.includes('"mock"') &&
      deployDemoPages.includes('["whoami"]') &&
      deployDemoPages.includes('"pages"') &&
      deployDemoPages.includes('"deploy"') &&
      deployDemoPages.includes("apps/web/dist") &&
      deployDemoPages.includes("--commit-dirty=true"),
    "demo deploy script must build the static mock demo and deploy it to Cloudflare Pages without Worker bindings.",
  );
  assert(
    packageJson.scripts["deploy:preview:dry-run"].includes("vp run -r build") &&
      packageJson.scripts["deploy:preview:dry-run"].includes("deploy-preflight.mjs preview") &&
      packageJson.scripts["deploy:production:dry-run"].includes("vp run -r build") &&
      packageJson.scripts["deploy:production:dry-run"].includes("deploy-preflight.mjs production"),
    "remote dry-run scripts must run deploy preflight and build web assets before Worker deploy dry-run.",
  );
  assert(
    packageJson.scripts["deploy:preview"].includes("vp run -r build") &&
      packageJson.scripts["deploy:preview"].includes("health:preview") &&
      packageJson.scripts["deploy:production"].includes("vp run -r build") &&
      packageJson.scripts["deploy:production"].includes("health:production"),
    "remote deploy scripts must build web assets, deploy the Worker, and run target health checks.",
  );
  assert(
    exists("scripts/wrangler-deploy-dry-run.mjs") &&
      workerPackageJson.scripts["deploy:dry-run"].includes("wrangler-deploy-dry-run.mjs") &&
      workerPackageJson.scripts["deploy:preview:dry-run"].includes("wrangler-deploy-dry-run.mjs") &&
      workerPackageJson.scripts["deploy:production:dry-run"].includes(
        "wrangler-deploy-dry-run.mjs",
      ),
    "worker dry-run scripts must use the Wrangler dry-run wrapper so successful dry-runs exit cleanly.",
  );
  assert(
    exists("scripts/wrangler-deploy.mjs") &&
      workerPackageJson.scripts["deploy:preview"].includes("wrangler-deploy.mjs") &&
      workerPackageJson.scripts["deploy:production"].includes("wrangler-deploy.mjs") &&
      wranglerDeployScript.includes('"deploy"') &&
      wranglerDeployScript.includes("WRANGLER_DEPLOY_TIMEOUT_MS") &&
      wranglerDeployScript.includes("wrangler-deploy-dry-run.mjs"),
    "worker deploy scripts must use the guarded Wrangler deploy wrapper for real target deploys.",
  );
  assert(
    wranglerDeployScript.includes('["whoami"]') &&
      wranglerDeployScript.includes("findWorkerVersionId") &&
      wranglerDeployScript.includes("Worker version id:") &&
      wranglerDeployDryRunScript.includes("requiresCloudflareAccount") &&
      wranglerDeployDryRunScript.includes('["whoami"]'),
    "deploy wrappers must run wrangler whoami and the final deploy must print the Worker version id.",
  );
}
