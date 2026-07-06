import { createAuditEvent } from "@carboti/audit";
import { prepareAuditInsert } from "./audit-store";
import type { CurrentUser } from "./auth-types";
import type { AppContext } from "./http-utils";
import { prepareImportJobEventInsert } from "./import-job-event-store";
import type { AiAdvisoryArtifactRow } from "./ai-advisory-store";

export async function writeAiAdvisoryDecision(input: {
  advisory: AiAdvisoryArtifactRow;
  advisoryId: string;
  context: AppContext;
  current: CurrentUser;
  jobId: string;
  targetStatus: "confirmed" | "dismissed";
}): Promise<AiAdvisoryArtifactRow> {
  const { advisory, advisoryId, context, current, jobId, targetStatus } = input;
  const now = new Date().toISOString();
  const columnPrefix = targetStatus === "confirmed" ? "confirmed" : "dismissed";

  await context.env.DB.batch([
    context.env.DB.prepare(
      `
        UPDATE ai_advisory_artifacts
        SET status = ?, ${columnPrefix}_by = ?, ${columnPrefix}_at = ?
        WHERE id = ? AND import_job_id = ? AND status = 'suggested'
      `,
    ).bind(targetStatus, current.user.id, now, advisoryId, jobId),
    prepareImportJobEventInsert(context.env, {
      importJobId: jobId,
      eventType: `ai_advisory.${targetStatus}`,
      actorUserId: current.user.id,
      message: `AI advisory ${targetStatus}.`,
      createdAt: now,
      metadata: {
        advisoryId,
      },
    }),
    prepareAuditInsert(
      context.env,
      createAuditEvent({
        action: `ai_advisory.${targetStatus}`,
        actor: {
          id: current.user.id,
          kind: "user",
        },
        subject: {
          id: advisoryId,
          kind: "ai_advisory_artifact",
        },
        metadata: {
          importJobId: jobId,
        },
      }),
    ),
  ]);

  return {
    ...advisory,
    status: targetStatus,
    ...(targetStatus === "confirmed"
      ? {
          confirmed_by: current.user.id,
          confirmed_at: now,
        }
      : {
          dismissed_by: current.user.id,
          dismissed_at: now,
        }),
  };
}
