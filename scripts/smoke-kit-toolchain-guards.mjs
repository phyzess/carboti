export function assertKitToolchainGuards(context) {
  const { assert, baseTsconfig, tsconfig, webViteConfig, workflow, workspace } = context;

  assert(
    workflow.includes("pnpm exec vp run verify:kit") &&
      workflow.includes("playwright install chromium") &&
      workflow.includes("node-version: 24"),
    "GitHub verify workflow must install Chromium and run verify:kit on Node 24.",
  );
  assert(workspace.includes("examples/*"), "workspace must include examples/*.");
  assert(workspace.includes("templates/feature"), "workspace must include templates/feature.");
  assert(!workspace.includes("domains/*"), "workspace must not include domains/*.");
  assert(
    tsconfig.includes("./examples/import-review"),
    "root tsconfig must reference examples/import-review.",
  );
  assert(
    tsconfig.includes("./examples/json-records"),
    "root tsconfig must reference examples/json-records.",
  );
  assert(tsconfig.includes("tsconfig.base.json"), "root tsconfig must extend the base config.");
  assert(
    baseTsconfig.includes('"@/components": ["./packages/ui/src"]') &&
      baseTsconfig.includes('"@/components/ui": ["./packages/ui/src"]') &&
      baseTsconfig.includes('"@/lib/utils": ["./packages/ui/src/utils.ts"]') &&
      webViteConfig.includes('find: "@/components"') &&
      webViteConfig.includes('find: "@/lib/utils"'),
    "base tsconfig and web Vite config must expose shadcn aliases to packages/ui.",
  );
  assert(
    tsconfig.includes("./templates/feature"),
    "root tsconfig must reference templates/feature.",
  );
  assert(tsconfig.includes("./packages/i18n"), "root tsconfig must reference packages/i18n.");
  assert(
    baseTsconfig.includes("@carboti/example-import-review"),
    "base tsconfig must expose the example import-review alias.",
  );
  assert(
    baseTsconfig.includes("@carboti/example-json-records"),
    "base tsconfig must expose the example json-records alias.",
  );
}
