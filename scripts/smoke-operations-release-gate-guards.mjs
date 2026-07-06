export function assertOperationsReleaseGateGuards(context) {
  const { assert, exists, packageJson, releaseGate } = context;

  assert(
    exists("scripts/release-gate.mjs") &&
      packageJson.scripts["release:preview"].includes("release-gate.mjs preview") &&
      packageJson.scripts["release:production"].includes("release-gate.mjs production") &&
      releaseGate.includes("verify:kit") &&
      releaseGate.includes("deploy:preview:dry-run") &&
      releaseGate.includes("deploy:production:dry-run") &&
      releaseGate.includes("db:migrate:preview") &&
      releaseGate.includes("db:migrate:production") &&
      releaseGate.includes("ops:failed-jobs") &&
      releaseGate.includes("deploy:production") &&
      releaseGate.includes("--yes") &&
      releaseGate.includes("Plan only"),
    "release gate must codify verify, dry-run, remote migration, failed-job snapshot, deploy, and health-check flow behind explicit --yes execution.",
  );
  assert(
    releaseGate.includes("QITU_PRODUCTION_WORKER_URL") &&
      releaseGate.includes("runOptionalInternalHealthChecks") &&
      releaseGate.includes("scripts/health-check.mjs"),
    "release gate must support optional internal Worker health checks after public deployment health.",
  );
}
