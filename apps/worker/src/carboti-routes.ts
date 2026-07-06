import type { Hono } from "hono";
import { registerCarbotiAgentRoutes } from "./carboti-agent-routes";
import { registerCarbotiApiClientRoutes } from "./carboti-api-client-routes";
import { registerCarbotiArtifactSubmitRoute } from "./carboti-artifact-submit-route";
import { registerCarbotiConnectorRoutes } from "./carboti-connector-routes";
import {
  registerCarbotiContractRoute,
  registerCarbotiOpenApiRoute,
} from "./carboti-contract-route";
import { registerCarbotiEvidenceRoutes } from "./carboti-evidence-routes";
import { registerCarbotiHttpIngestRoute } from "./carboti-http-ingest-route";
import { registerCarbotiProcessorRoutes } from "./carboti-processor-routes";
import { registerCarbotiSecretRoutes } from "./carboti-secret-routes";

export function registerCarbotiRoutes(app: Hono<{ Bindings: Env }>): void {
  registerCarbotiContractRoute(app);
  registerCarbotiOpenApiRoute(app);
  registerCarbotiApiClientRoutes(app);
  registerCarbotiSecretRoutes(app);
  registerCarbotiHttpIngestRoute(app);
  registerCarbotiConnectorRoutes(app);
  registerCarbotiArtifactSubmitRoute(app);
  registerCarbotiProcessorRoutes(app);
  registerCarbotiAgentRoutes(app);
  registerCarbotiEvidenceRoutes(app);
}
