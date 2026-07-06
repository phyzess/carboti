import {
  carbotiArtifactKinds,
  carbotiDeliveryStatuses,
  carbotiJobStatuses,
  carbotiObjectKinds,
  carbotiProcessorKinds,
  carbotiSinkKinds,
  carbotiSourceKinds,
} from "@carboti/core";
import type { Hono } from "hono";

export function registerCarbotiContractRoute(app: Hono<{ Bindings: Env }>): void {
  app.get("/api/carboti/contract", (context) =>
    context.json({
      service: "carboti",
      tagline: "Raw-first data ingestion for emails, documents, and AI agents.",
      version: "v0",
      kinds: {
        artifacts: carbotiArtifactKinds,
        deliveries: carbotiDeliveryStatuses,
        jobs: carbotiJobStatuses,
        objects: carbotiObjectKinds,
        processors: carbotiProcessorKinds,
        sinks: carbotiSinkKinds,
        sources: carbotiSourceKinds,
      },
    }),
  );
}
