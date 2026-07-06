export function createRuntimeScriptsContext({ text }) {
  const devAllScript = [
    text("scripts/dev-all.mjs"),
    text("scripts/dev-all-config.mjs"),
    text("scripts/dev-all-ports.mjs"),
    text("scripts/dev-all-runner.mjs"),
  ].join("\n");
  const wranglerD1MigrateLocalScript = [
    text("scripts/wrangler-d1-migrate-local.mjs"),
    text("scripts/wrangler-d1-migrate-local-config.mjs"),
    text("scripts/wrangler-d1-migrate-local-output.mjs"),
    text("scripts/wrangler-d1-migrate-local-runner.mjs"),
    text("scripts/wrangler-d1-migrate-local-success.mjs"),
  ].join("\n");

  return {
    devAllScript,
    wranglerD1MigrateLocalScript,
    wranglerDevLocalScript: text("scripts/wrangler-dev-local.mjs"),
    wranglerTypesScript: text("scripts/wrangler-types.mjs"),
  };
}
