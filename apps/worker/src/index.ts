import { parseImportJobMessage, type ImportJobMessage } from "@carboti/jobs";
import { Hono } from "hono";
import { registerAiAdvisoryRoutes } from "./ai-advisory-routes";
import { registerAuditRoutes } from "./audit-routes";
import { registerAuthRoutes } from "./auth-routes";
import { registerCarbotiRoutes } from "./carboti-routes";
import { registerImportJobRoutes } from "./import-job-routes";
import { processImportJob } from "./import-job-runner";
import { registerImportReviewRoutes } from "./import-review-routes";
import { handleInboundEmail } from "./inbound-email";
import { runtimeConfig } from "./runtime";
import { registerSourceRoutes } from "./source-routes";

const app = new Hono<{ Bindings: Env }>();

app.get("/health", (context) => {
  const runtime = runtimeConfig(context.env);

  return context.json({
    ok: true,
    service: "carboti-worker",
    environment: runtime.APP_ENV,
  });
});

registerAuthRoutes(app);
registerCarbotiRoutes(app);
registerSourceRoutes(app);
registerImportJobRoutes(app);
registerAuditRoutes(app);
registerImportReviewRoutes(app);
registerAiAdvisoryRoutes(app);

export default {
  fetch(request, env, ctx) {
    return app.fetch(request, env, ctx);
  },
  async queue(batch, env) {
    for (const message of batch.messages) {
      const body = parseImportJobMessage(message.body);
      await processImportJob(env, body);
    }
  },
  async email(message, env) {
    await handleInboundEmail(message, env);
  },
} satisfies ExportedHandler<Env, ImportJobMessage>;
