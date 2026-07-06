export function createOperationsScriptsContext({ text }) {
  const opsFailedJobs = [
    text("scripts/ops-failed-jobs.mjs"),
    text("scripts/ops-failed-jobs-config.mjs"),
    text("scripts/ops-failed-jobs-query.mjs"),
    text("scripts/ops-failed-jobs-runner.mjs"),
    text("scripts/wrangler-observed-process.mjs"),
  ].join("\n");
  const cleanupLocalSmoke = [
    text("scripts/cleanup-local-smoke.mjs"),
    text("scripts/cleanup-local-smoke-sql.mjs"),
    text("scripts/cleanup-local-smoke-d1.mjs"),
  ].join("\n");
  const deployPreflight = [
    text("scripts/deploy-preflight.mjs"),
    text("scripts/deploy-preflight-config.mjs"),
    text("scripts/deploy-preflight-policy.mjs"),
    text("scripts/deploy-preflight-checks.mjs"),
    text("scripts/deploy-preflight-url-checks.mjs"),
    text("scripts/deploy-preflight-email-checks.mjs"),
    text("scripts/deploy-preflight-binding-checks.mjs"),
    text("scripts/deploy-preflight-output.mjs"),
  ].join("\n");
  const deployDemoPages = [
    text("scripts/deploy-demo-pages.mjs"),
    text("scripts/deploy-demo-pages-args.mjs"),
    text("scripts/deploy-demo-pages-output.mjs"),
    text("scripts/deploy-demo-pages-runner.mjs"),
  ].join("\n");
  const operatorAdminInvitation = [
    text("scripts/operator-admin-invitation.mjs"),
    text("scripts/operator-admin-invitation-args.mjs"),
    text("scripts/operator-admin-invitation-config.mjs"),
    text("scripts/operator-admin-invitation-validation.mjs"),
    text("scripts/operator-admin-invitation-build.mjs"),
    text("scripts/operator-admin-invitation-sql.mjs"),
    text("scripts/operator-admin-invitation-output.mjs"),
    text("scripts/operator-admin-invitation-runner.mjs"),
    text("scripts/operator-admin-invitation-d1.mjs"),
    text("scripts/wrangler-observed-process.mjs"),
  ].join("\n");
  const releaseGate = [
    text("scripts/release-gate.mjs"),
    text("scripts/release-gate-config.mjs"),
    text("scripts/release-gate-args.mjs"),
    text("scripts/release-gate-plan.mjs"),
    text("scripts/release-gate-runner.mjs"),
  ].join("\n");
  const healthCheck = [
    text("scripts/health-check.mjs"),
    text("scripts/health-check-config.mjs"),
    text("scripts/health-check-url.mjs"),
    text("scripts/health-check-runner.mjs"),
  ].join("\n");
  const wranglerDeployScript = [
    text("scripts/wrangler-deploy.mjs"),
    text("scripts/wrangler-deploy-config.mjs"),
    text("scripts/wrangler-deploy-runner.mjs"),
    text("scripts/wrangler-observed-process.mjs"),
    text("scripts/wrangler-deploy-version.mjs"),
  ].join("\n");
  const wranglerDeployDryRunScript = [
    text("scripts/wrangler-deploy-dry-run.mjs"),
    text("scripts/wrangler-deploy-dry-run-config.mjs"),
    text("scripts/wrangler-deploy-dry-run-runner.mjs"),
    text("scripts/wrangler-deploy-dry-run-observer.mjs"),
    text("scripts/wrangler-observed-process.mjs"),
  ].join("\n");

  return {
    cleanupLocalSmoke,
    deployDemoPages,
    deployPreflight,
    healthCheck,
    operatorAdminInvitation,
    opsFailedJobs,
    releaseGate,
    wranglerDeployDryRunScript,
    wranglerDeployScript,
  };
}
