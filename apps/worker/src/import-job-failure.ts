import { createAuditEvent } from "@carboti/audit";
import type { ImportFailureClass } from "@carboti/import-pipeline";
import { prepareAuditInsert } from "./audit-store";
import { prepareAlertEventInsert } from "./event-store";
import { prepareImportJobEventInsert } from "./import-job-event-store";

export async function markImportJobFailed(
  env: Env,
  input: {
    jobId: string;
    sourceFileId?: string | null | undefined;
    reason: string;
    action: string;
    failureClass?: ImportFailureClass | undefined;
  },
): Promise<void> {
  const now = new Date().toISOString();
  const failureClass = input.failureClass ?? "infrastructure";
  await env.DB.batch([
    env.DB.prepare(
      `
        UPDATE import_jobs
        SET
          status = 'failed',
          failure_reason = ?,
          failure_class = ?,
          completed_at = ?,
          updated_at = ?
        WHERE id = ?
      `,
    ).bind(input.reason, failureClass, now, now, input.jobId),
    prepareImportJobEventInsert(env, {
      importJobId: input.jobId,
      sourceFileId: input.sourceFileId ?? null,
      eventType: input.action,
      statusTo: "failed",
      message: input.reason,
      createdAt: now,
      metadata: {
        failureClass,
      },
    }),
    prepareAlertEventInsert(env, {
      severity:
        failureClass === "infrastructure" || failureClass === "queue_dispatch"
          ? "critical"
          : "warning",
      alertType: "import_job.failed",
      entityType: "import_job",
      entityId: input.jobId,
      title: "Import job failed",
      message: input.reason,
      createdAt: now,
      metadata: {
        action: input.action,
        failureClass,
        sourceFileId: input.sourceFileId ?? null,
      },
    }),
    prepareAuditInsert(
      env,
      createAuditEvent({
        action: input.action,
        actor: {
          id: "queue",
          kind: "system",
        },
        subject: {
          id: input.jobId,
          kind: "import_job",
        },
        metadata: {
          reason: input.reason,
          failureClass,
        },
      }),
    ),
  ]);
}
