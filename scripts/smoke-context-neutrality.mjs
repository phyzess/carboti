export function createSmokeNeutralityContext({
  caseSensitiveForbiddenTerm,
  docsContext,
  forbiddenTerm,
  packageContext,
  scriptContext,
  text,
  webContext,
  workerContext,
}) {
  const businessNeutralityText = [
    workerContext.workerSources,
    webContext.webSources,
    packageContext.uiSources,
    packageContext.importPipeline,
    packageContext.chartsPackage,
    packageContext.templateFeature,
    packageContext.templateFeatureRegistry,
    packageContext.exampleImportReview,
    packageContext.exampleJsonRecords,
    scriptContext.workerIntegration,
    docsContext.readme,
    docsContext.deployment,
    text("docs/architecture/package-boundaries.md"),
    text("docs/architecture/ui-design-system.md"),
    text("docs/decisions/decision-log.md"),
    text("docs/decisions/refactor-locality-2026-07.md"),
  ].join("\n");
  const forbiddenBusinessTerms = [
    caseSensitiveForbiddenTerm("F", "OF"),
    caseSensitiveForbiddenTerm("N", "AV"),
    forbiddenTerm("valu", "ation"),
    forbiddenTerm("port", "folio"),
    forbiddenTerm("watch", "list"),
    forbiddenTerm("simu", "lation"),
    forbiddenTerm("Wen", "yao"),
  ];

  return { businessNeutralityText, forbiddenBusinessTerms };
}
