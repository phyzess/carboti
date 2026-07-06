export function assertRuntimeAppInventoryGuards(context) {
  assertExists(context, "apps/worker/vitest.config.ts", "worker Vitest runtime config must exist.");
  assertExists(
    context,
    "apps/worker/test/tsconfig.json",
    "worker runtime test tsconfig must exist.",
  );
  assertExists(
    context,
    "apps/worker/test/worker-runtime.test.ts",
    "worker runtime smoke test must exist.",
  );
  assertExists(context, "apps/web/src/api.ts", "web API client must exist.");
  assertExists(context, "apps/web/src/types.ts", "web response types must exist.");
  assertExists(
    context,
    "packages/charts/src/index.tsx",
    "charts package must expose a TSX entrypoint.",
  );
}

function assertExists({ assert, exists }, file, message = `${file} must exist.`) {
  assert(exists(file), message);
}
