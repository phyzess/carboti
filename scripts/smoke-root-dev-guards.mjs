export function assertRootDevGuards(context) {
  const { assert } = context;

  assert(
    context.packageJson.scripts.dev === "node scripts/dev-all.mjs" &&
      context.packageJson.scripts["dev:web"] === "vp dev apps/web --host 0.0.0.0" &&
      context.packageJson.scripts["dev:all"] === "node scripts/dev-all.mjs",
    "default dev command must start the full local stack, with dev:web reserved for web-only debugging.",
  );
  assert(
    context.workerPackageJson.scripts.dev === "node ../../scripts/wrangler-dev-local.mjs" &&
      context.wranglerDevLocalScript.includes("QITU_WORKER_PORT") &&
      context.wranglerDevLocalScript.includes('"--port"'),
    "worker dev must route through a local Wrangler wrapper that honors QITU_WORKER_PORT.",
  );
  assert(
    context.devAllScript.includes('"@carboti/web"') &&
      context.devAllScript.includes('"@carboti/worker"') &&
      context.devAllScript.includes("findOpenPort") &&
      context.devAllScript.includes("QITU_WEB_PORT") &&
      context.devAllScript.includes("QITU_WORKER_PORT") &&
      context.devAllScript.includes("QITU_WORKER_ORIGIN") &&
      context.devAllScript.includes("QITU_PUBLIC_APP_URL") &&
      context.browserSmoke.includes("findOpenPort") &&
      context.browserSmoke.includes("QITU_WEB_PORT") &&
      context.browserSmoke.includes("QITU_PUBLIC_APP_URL") &&
      context.browserSmoke.includes("QITU_WORKER_PORT") &&
      context.browserSmoke.includes("QITU_WORKER_ORIGIN") &&
      context.wranglerDevLocalScript.includes("QITU_PUBLIC_APP_URL") &&
      context.wranglerDevLocalScript.includes("PUBLIC_APP_URL:") &&
      context.webViteConfig.includes("QITU_WEB_PORT") &&
      context.webViteConfig.includes("QITU_WORKER_ORIGIN") &&
      context.webViteConfig.includes("QITU_WORKER_PORT") &&
      !context.devAllScript.includes("8787") &&
      !context.browserSmoke.includes("http://127.0.0.1:8787${path}"),
    "dev:all, browser smoke, and Vite proxy must share a dynamically assigned Worker origin instead of hard-coding port 8787.",
  );
}
