import {
  generateLocalImportReviewAdvisory,
  requiresHumanConfirmation,
  type AdvisoryArtifact,
} from "@carboti/ai-advisory";
import { createAuditEvent } from "@carboti/audit";
import { prepareAuditInsert } from "./audit-store";
import { prepareAiAdvisoryInsert } from "./ai-advisory-store";
import type { CurrentUser } from "./auth-types";
import type { AppContext } from "./http-utils";
import { prepareImportJobEventInsert } from "./import-job-event-store";
import type { ImportJobReviewRow } from "./import-review-row-types";
import type { ImportReviewStats } from "./import-review-stats";

export async function writeGeneratedAiAdvisory(input: {
  context: AppContext;
  current: CurrentUser;
  job: ImportJobReviewRow;
  jobId: string;
  stats: ImportReviewStats;
}): Promise<AdvisoryArtifact> {
  const { context, current, job, jobId, stats } = input;
  const artifact = await generateLocalImportReviewAdvisory({
    importJobId: jobId,
    createdBy: current.user.id,
    recordCount: stats.recordCount,
    issueCount: stats.issueCount,
    pendingCount: stats.pending,
    approvedCount: stats.approved,
    rejectedCount: stats.rejected,
    committedCount: stats.committed,
  });
  const humanConfirmationRequired = requiresHumanConfirmation(artifact);

  await context.env.DB.batch([
    prepareAiAdvisoryInsert(context.env, artifact),
    prepareImportJobEventInsert(context.env, {
      importJobId: job.id,
      sourceFileId: job.source_file_id,
      eventType: "ai_advisory.generated",
      actorUserId: current.user.id,
      message: "AI advisory generated for import review.",
      createdAt: artifact.createdAt,
      metadata: {
        provider: artifact.provider,
        model: artifact.model,
        promptVersion: artifact.promptVersion,
        humanConfirmationRequired,
      },
    }),
    prepareAuditInsert(
      context.env,
      createAuditEvent({
        action: "ai_advisory.generated",
        actor: {
          id: current.user.id,
          kind: "user",
        },
        subject: {
          id: artifact.id,
          kind: "ai_advisory_artifact",
        },
        metadata: {
          importJobId: job.id,
          provider: artifact.provider,
          model: artifact.model,
          promptVersion: artifact.promptVersion,
          humanConfirmationRequired,
        },
      }),
    ),
  ]);

  return artifact;
}
