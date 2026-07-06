export function createSmokeDocsContext({ text }) {
  const emailDeliverabilityDoc = text("docs/operations/email-deliverability.md");
  const uiComponentProvenanceDoc = text("docs/architecture/ui-component-provenance.md");
  const workflow = text(".github/workflows/verify.yml");
  const readme = text("README.md");
  const deployment = text("docs/deployment.md");
  const demoDoc = text("docs/demo.md");
  const demoDocZh = text("docs/demo.zh-CN.md");
  const decisionLog = text("docs/decisions/decision-log.md");
  const decisionLogZh = text("docs/decisions/decision-log.zh-CN.md");
  const dlqRunbook = text("docs/operations/dlq-remediation.md");
  const refactorLocalityDecision = text("docs/decisions/refactor-locality-2026-07.md");
  const refactorLocalityDecisionZh = text("docs/decisions/refactor-locality-2026-07.zh-CN.md");
  const readmeZh = text("README.zh-CN.md");
  const docsZh = text("docs/zh-CN.md");
  const chineseDocs = [
    "README.zh-CN.md",
    "docs/zh-CN.md",
    "docs/kit-completion.zh-CN.md",
    "docs/setup.zh-CN.md",
    "docs/capability-matrix.zh-CN.md",
    "docs/architecture/overview.zh-CN.md",
    "docs/architecture/package-boundaries.zh-CN.md",
    "docs/architecture/data-model.zh-CN.md",
    "docs/architecture/auth-security.zh-CN.md",
    "docs/architecture/import-pipeline.zh-CN.md",
    "docs/architecture/ai-advisory.zh-CN.md",
    "docs/architecture/ui-design-system.zh-CN.md",
    "docs/architecture/dependencies.zh-CN.md",
    "docs/guides/create-app.zh-CN.md",
    "docs/guides/add-feature.zh-CN.md",
    "docs/guides/first-vertical-slice.zh-CN.md",
    "docs/deployment.zh-CN.md",
    "docs/troubleshooting.zh-CN.md",
    "docs/operations/dlq-remediation.zh-CN.md",
    "docs/agents/agent-integration.zh-CN.md",
    "docs/roadmap.zh-CN.md",
    "docs/decisions/decision-log.zh-CN.md",
    "docs/decisions/refactor-locality-2026-07.zh-CN.md",
  ];

  return {
    chineseDocs,
    demoDoc,
    demoDocZh,
    decisionLog,
    decisionLogZh,
    deployment,
    dlqRunbook,
    docsZh,
    emailDeliverabilityDoc,
    readme,
    readmeZh,
    refactorLocalityDecision,
    refactorLocalityDecisionZh,
    uiComponentProvenanceDoc,
    workflow,
  };
}
