import type { Hono } from "hono";
import { registerCarbotiContractRoute } from "./carboti-contract-route";
import { registerCarbotiEvidenceRoutes } from "./carboti-evidence-routes";
import { registerCarbotiHttpIngestRoute } from "./carboti-http-ingest-route";

export function registerCarbotiRoutes(app: Hono<{ Bindings: Env }>): void {
  registerCarbotiContractRoute(app);
  registerCarbotiHttpIngestRoute(app);
  registerCarbotiEvidenceRoutes(app);
}
