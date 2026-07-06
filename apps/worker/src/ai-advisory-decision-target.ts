import type { CurrentUser } from "./auth-types";
import { readCurrentUser, requirePermission } from "./auth-routes";
import { readAiAdvisoryArtifact, type AiAdvisoryArtifactRow } from "./ai-advisory-store";
import { authError, type AppContext } from "./http-utils";

type AiAdvisoryDecisionTargetResult =
  | {
      ok: true;
      advisory: AiAdvisoryArtifactRow;
      advisoryId: string;
      current: CurrentUser;
      jobId: string;
    }
  | {
      ok: false;
      response: Response;
    };

export async function readAiAdvisoryDecisionTarget(
  context: AppContext,
): Promise<AiAdvisoryDecisionTargetResult> {
  const current = await readCurrentUser(context);
  if (!current) {
    return {
      ok: false,
      response: authError(context, "unauthorized", "Login is required.", 401),
    };
  }

  const denied = await requirePermission(context, current, "ai_advisory:write");
  if (denied) {
    return {
      ok: false,
      response: denied,
    };
  }

  const jobId = context.req.param("jobId");
  const advisoryId = context.req.param("advisoryId");
  if (!jobId || !advisoryId) {
    return {
      ok: false,
      response: authError(context, "ai_advisory_not_found", "AI advisory was not found.", 404),
    };
  }

  const advisory = await readAiAdvisoryArtifact(context.env, {
    advisoryId,
    importJobId: jobId,
  });
  if (!advisory) {
    return {
      ok: false,
      response: authError(context, "ai_advisory_not_found", "AI advisory was not found.", 404),
    };
  }

  return {
    ok: true,
    advisory,
    advisoryId,
    current,
    jobId,
  };
}
