export function assertPackageManifestWorkerScriptGuards(context) {
  const { assert, workerPackage, wranglerD1MigrateLocalScript, wranglerTypesScript } = context;

  assert(
    workerPackage.scripts["cf:typegen"] === "node ../../scripts/wrangler-types.mjs" &&
      wranglerTypesScript.includes("wrangler") &&
      wranglerTypesScript.includes("Types written to worker-configuration.d.ts"),
    "worker typegen must use the guarded wrangler types wrapper so verify:kit can complete.",
  );
  assert(
    workerPackage.scripts["db:migrate:local"] ===
      "node ../../scripts/wrangler-d1-migrate-local.mjs" &&
      wranglerD1MigrateLocalScript.includes("d1") &&
      wranglerD1MigrateLocalScript.includes("QITU_D1_PERSIST_TO") &&
      wranglerD1MigrateLocalScript.includes("No migrations to apply!") &&
      wranglerD1MigrateLocalScript.includes("0007_event_foundations.sql") &&
      wranglerD1MigrateLocalScript.includes("\\u2705"),
    "local D1 migrations must use the guarded wrangler wrapper so verify:kit can complete.",
  );
}
