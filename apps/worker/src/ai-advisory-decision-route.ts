import { writeAiAdvisoryDecision } from "./ai-advisory-decision-record";
import { readAiAdvisoryDecisionTarget } from "./ai-advisory-decision-target";
import { publicAiAdvisoryArtifact } from "./ai-advisory-store";
import { authError, type AppContext } from "./http-utils";

export async function updateAiAdvisoryStatusResponse(
  context: AppContext,
  targetStatus: "confirmed" | "dismissed",
): Promise<Response> {
  const target = await readAiAdvisoryDecisionTarget(context);
  if (!target.ok) return target.response;
  const { advisory, advisoryId, current, jobId } = target;

  if (advisory.status === targetStatus) {
    return context.json({
      advisory: publicAiAdvisoryArtifact(advisory),
      duplicate: true,
    });
  }

  if (advisory.status !== "suggested") {
    return authError(
      context,
      "ai_advisory_not_suggested",
      "Only suggested AI advisories can be updated.",
      409,
    );
  }

  const updatedAdvisory = await writeAiAdvisoryDecision({
    advisory,
    advisoryId,
    context,
    current,
    jobId,
    targetStatus,
  });

  return context.json({
    advisory: publicAiAdvisoryArtifact(updatedAdvisory),
  });
}
