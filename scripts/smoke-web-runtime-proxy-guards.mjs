export function assertWebRuntimeProxyGuards(context) {
  const { assert, webViteConfig } = context;

  assert(
    webViteConfig.includes('"/api": workerOrigin'),
    "web dev server must proxy /api to the configured local Worker origin.",
  );
  assert(
    webViteConfig.includes('"/health": workerOrigin'),
    "web dev server must proxy /health to the configured local Worker origin.",
  );
}
