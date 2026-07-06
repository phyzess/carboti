import type { Hono } from "hono";
import { registerCarbotiArtifactSubmitRoute } from "./carboti-artifact-submit-route";
import {
  registerCarbotiContractRoute,
  registerCarbotiOpenApiRoute,
} from "./carboti-contract-route";
import { registerCarbotiEvidenceRoutes } from "./carboti-evidence-routes";
import { registerCarbotiHttpIngestRoute } from "./carboti-http-ingest-route";
import { registerCarbotiProcessorRoutes } from "./carboti-processor-routes";

export function registerCarbotiRoutes(app: Hono<{ Bindings: Env }>): void {
  registerCarbotiContractRoute(app);
  registerCarbotiOpenApiRoute(app);
  registerCarbotiHttpIngestRoute(app);
  registerCarbotiArtifactSubmitRoute(app);
  registerCarbotiProcessorRoutes(app);
  registerCarbotiEvidenceRoutes(app);
}
