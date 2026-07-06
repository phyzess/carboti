export function assertRootToolchainGuards(context) {
  const { assert } = context;

  assert(
    context.packageJson.packageManager === "pnpm@11.5.2",
    "packageManager must stay pinned to pnpm@11.5.2.",
  );
  assert(
    context.packageJson.devDependencies.typescript === "7.0.1-rc",
    "typescript must stay pinned to 7.0.1-rc.",
  );
  assert(
    context.packageJson.devDependencies["vite-plus"] === "0.2.1",
    "vite-plus must stay pinned to 0.2.1.",
  );
  assert(
    context.packageJson.devDependencies["@playwright/test"] === "1.61.0",
    "@playwright/test must stay pinned to 1.61.0.",
  );
  assert(
    context.packageJson.devDependencies.shadcn === "4.11.0",
    "shadcn CLI must stay pinned to 4.11.0 for the recorded UI registry workflow.",
  );
  assert(
    context.packageJson.devDependencies.tslib === "2.8.1",
    "tslib must stay pinned so the local shadcn CLI dependency chain can execute.",
  );
  assert(
    context.packageJson.scripts["ui:add"] === "shadcn add --cwd packages/ui" &&
      context.packageJson.scripts["ui:docs"] === "shadcn docs --cwd packages/ui --base base" &&
      context.packageJson.scripts["ui:info"] === "shadcn info --cwd packages/ui" &&
      context.packageJson.scripts["ui:search"] === "shadcn search @shadcn --cwd packages/ui" &&
      context.packageJson.scripts["ui:view"] === "shadcn view --cwd packages/ui",
    "root package scripts must expose the shadcn registry discovery and install workflow.",
  );
}
