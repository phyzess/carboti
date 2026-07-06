import { importFeatureAdapter } from "./import-feature";
import { templateFeatureFixture } from "./fixtures";
import { templateFeatureWebSurface } from "./web-surface";

export const featureImportAdapters = [importFeatureAdapter] as const;
export const featureIntegrationFixtures = [templateFeatureFixture] as const;
export const featureWebSurfaces = [templateFeatureWebSurface] as const;

export type RegisteredFeatureImportAdapter = (typeof featureImportAdapters)[number];

export function selectFeatureImportAdapter(source: {
  filename: string;
  contentType: string;
}): RegisteredFeatureImportAdapter | null {
  return featureImportAdapters.find((adapter) => adapter.canHandle(source)) ?? null;
}
