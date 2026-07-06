export const templateFeatureWebSurface = {
  detailRoute: "/workspace/template-feature",
  i18nKeys: [
    "feature.template.title",
    "feature.template.description",
    "feature.template.reviewTitle",
    "feature.template.empty",
  ],
  navigation: {
    group: "workspace",
    id: "template-feature",
    labelKey: "feature.template.title",
  },
  smokePath: {
    confirmTextKey: "action.confirmPending",
    fixtureExport: "templateFeatureFixture",
    route: "/workspace/template-feature",
  },
} as const;

export type TemplateFeatureWebSurface = typeof templateFeatureWebSurface;
