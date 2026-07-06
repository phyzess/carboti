import type { Hono } from "hono";
import { writeGeneratedAiAdvisory } from "./ai-advisory-generate-record";
import { readAiAdvisoryGenerateTarget } from "./ai-advisory-generate-target";

export function registerAiAdvisoryGenerateRoute(app: Hono<{ Bindings: Env }>): void {
  app.post("/api/import-jobs/:jobId/advisories", async (context) => {
    const target = await readAiAdvisoryGenerateTarget(context);
    if (!target.ok) return target.response;

    const artifact = await writeGeneratedAiAdvisory({
      context,
      current: target.current,
      job: target.job,
      jobId: target.jobId,
      stats: target.stats,
    });

    return context.json(
      {
        advisory: artifact,
      },
      201,
    );
  });
}
