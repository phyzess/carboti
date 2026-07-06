export function createBrowserScriptsContext({ text }) {
  const browserSmoke = [
    text("scripts/browser-smoke.mjs"),
    text("scripts/browser-smoke-runtime.mjs"),
    text("scripts/browser-smoke-dev-server.mjs"),
    text("scripts/browser-smoke-dev-server-log.mjs"),
    text("scripts/browser-smoke-dev-server-process.mjs"),
    text("scripts/browser-smoke-dev-server-stop.mjs"),
    text("scripts/browser-smoke-network.mjs"),
    text("scripts/browser-smoke-browser-launch.mjs"),
    text("scripts/browser-smoke-fixture.mjs"),
    text("scripts/browser-smoke-preflight.mjs"),
    text("scripts/browser-smoke-preflight-routes.mjs"),
    text("scripts/browser-smoke-auth-flow.mjs"),
    text("scripts/browser-smoke-review-primary.mjs"),
    text("scripts/browser-smoke-review-submit.mjs"),
    text("scripts/browser-smoke-source-commit.mjs"),
    text("scripts/browser-smoke-audit-filter.mjs"),
    text("scripts/browser-smoke-review-diagnostics.mjs"),
    text("scripts/browser-smoke-admin-flow.mjs"),
  ].join("\n");

  return { browserSmoke };
}
