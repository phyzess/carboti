export const templateFeatureFixture = {
  contentType: "text/csv",
  expectedCommittedCount: 2,
  expectedIssueCodes: ["empty_value"],
  expectedStagedCount: 2,
  filename: "template-feature.csv",
  sourceText: ["label,value", "First,10", "Second,"].join("\n"),
} as const;

export type TemplateFeatureFixture = typeof templateFeatureFixture;
