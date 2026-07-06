export function assertPackageManifestWorkerGuards(context) {
  const { assert, workerPackage } = context;

  assert(
    workerPackage.dependencies["@carboti/ai-advisory"] === "workspace:*",
    "worker must depend on @carboti/ai-advisory.",
  );
  assert(
    workerPackage.dependencies["@carboti/auth"] === "workspace:*",
    "worker must depend on @carboti/auth.",
  );
  assert(
    workerPackage.dependencies["@carboti/email"] === "workspace:*",
    "worker must depend on @carboti/email.",
  );
  assert(
    workerPackage.dependencies["@carboti/rbac"] === "workspace:*",
    "worker must depend on @carboti/rbac.",
  );
  assert(
    !workerPackage.dependencies["@carboti/example-import-review"] &&
      !workerPackage.dependencies["@carboti/example-json-records"],
    "worker must not depend on optional example packages; starter adapters must be app-owned.",
  );
  assert(
    workerPackage.dependencies["@carboti/import-pipeline"] === "workspace:*",
    "worker must declare its @carboti/import-pipeline type contract dependency.",
  );
  assert(
    workerPackage.dependencies["@carboti/i18n"] === "workspace:*",
    "worker must depend on @carboti/i18n for locale negotiation.",
  );
  assert(
    workerPackage.devDependencies["@cloudflare/vitest-pool-workers"] === "0.16.18" &&
      workerPackage.devDependencies.vitest === "4.1.9" &&
      workerPackage.devDependencies["@vitest/runner"] === "4.1.9" &&
      workerPackage.devDependencies["@vitest/snapshot"] === "4.1.9",
    "worker runtime test dependencies must stay pinned.",
  );
  assert(
    workerPackage.scripts["test:runtime"] === "vitest run --config vitest.config.ts",
    "worker package must expose test:runtime.",
  );
}
