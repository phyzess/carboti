export function assertKitDocumentationGuards(context) {
  const {
    assert,
    decisionLog,
    decisionLogZh,
    demoDoc,
    demoDocZh,
    docsZh,
    readme,
    readmeZh,
    refactorLocalityDecision,
    refactorLocalityDecisionZh,
  } = context;

  assert(readme.includes("business-neutral"), "README must describe qitu as business-neutral.");
  assert(
    readme.includes("README.zh-CN.md") && readme.includes("docs/zh-CN.md"),
    "README must link to the Chinese documentation entrypoints.",
  );
  assert(
    readmeZh.includes("鵸鵌") &&
      readmeZh.includes("歧途") &&
      readmeZh.includes("@carboti/*") &&
      readmeZh.includes("docs/zh-CN.md"),
    "Chinese README must preserve the qitu naming story, package prefix, and docs index link.",
  );
  assert(
    docsZh.includes("README.zh-CN.md") &&
      docsZh.includes("kit-completion.zh-CN.md") &&
      docsZh.includes("architecture/data-model.zh-CN.md") &&
      docsZh.includes("guides/first-vertical-slice.zh-CN.md") &&
      docsZh.includes("agents/agent-integration.zh-CN.md") &&
      docsZh.includes("deployment.zh-CN.md") &&
      docsZh.includes("decisions/refactor-locality-2026-07.zh-CN.md"),
    "Chinese docs index must point to the key Chinese documentation entrypoints.",
  );
  assert(
    readme.includes("Two app-owned starter feature adapters") &&
      readme.includes("Optional example feature packages") &&
      readme.includes("runnable kit baseline"),
    "README must describe the current starter adapters and optional example packages.",
  );
  assert(
    demoDoc.includes("apps/web/src/api-client.ts") &&
      demoDoc.includes("mock-api-*-routes.ts") &&
      demoDoc.includes("mock-api-*-operations.ts") &&
      demoDoc.includes("mock-api-seed-*") &&
      demoDoc.includes("browser `localStorage`"),
    "Static demo docs must describe the current split mock API route, operation, seed, and storage shape.",
  );
  assert(
    demoDocZh.includes("apps/web/src/api-client.ts") &&
      demoDocZh.includes("mock-api-*-routes.ts") &&
      demoDocZh.includes("mock-api-*-operations.ts") &&
      demoDocZh.includes("mock-api-seed-*") &&
      demoDocZh.includes("浏览器 `localStorage`"),
    "Chinese static demo docs must describe the current split mock API route, operation, seed, and storage shape.",
  );
  assert(
    decisionLog.includes("Refactor Locality Detail Record") &&
      decisionLog.includes("docs/decisions/refactor-locality-2026-07.md") &&
      refactorLocalityDecision.includes("2026-07 Refactor Locality Decision Details") &&
      refactorLocalityDecision.includes("Animated Icon CSS Motion Variables"),
    "English decision log must stay a short index that links the July refactor locality detail record.",
  );
  assert(
    decisionLogZh.includes("Refactor Locality Detail Record") &&
      decisionLogZh.includes("docs/decisions/refactor-locality-2026-07.zh-CN.md") &&
      refactorLocalityDecisionZh.includes("2026-07 Refactor Locality 决策详情") &&
      refactorLocalityDecisionZh.includes("Animated Icon CSS Motion Variables"),
    "Chinese decision log must stay a short index that links the July refactor locality detail record.",
  );
}
