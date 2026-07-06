export function assertOperationsHealthGuards(context) {
  const { assert, exists, healthCheck } = context;

  assert(
    exists("scripts/health-check.mjs") &&
      healthCheck.includes("/health") &&
      healthCheck.includes("carboti-worker") &&
      healthCheck.includes("environment") &&
      healthCheck.includes("QITU_PREVIEW_APP_URL") &&
      healthCheck.includes("QITU_PRODUCTION_APP_URL") &&
      healthCheck.includes("QITU_HEALTH_TIMEOUT_MS"),
    "health check script must verify the qitu Worker /health contract without requiring secrets.",
  );
}
