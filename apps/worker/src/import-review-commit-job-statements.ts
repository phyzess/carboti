import { createAuditEvent } from "@carboti/audit";
import { prepareAuditInsert } from "./audit-store";
import type { WorkerImportAdapter } from "./import-adapters";
import { prepareImportJobEventInsert } from "./import-job-event-store";
import type { ImportJobReviewRow } from "./import-review-row-types";

export function prepareImportJobCommittedStatements(
  env: Env,
  input: {
    adapter: WorkerImportAdapter;
    committedAt: string;
    committedCount: number;
    currentUserId: string;
    job: ImportJobReviewRow;
    jobId: string;
    jobStatusAfterCommit: string;
  },
): D1PreparedStatement[] {
  return [
    env.DB.prepare(
      `
        UPDATE import_jobs
        SET status = ?, completed_at = ?, updated_at = ?
        WHERE id = ?
      `,
    ).bind(input.jobStatusAfterCommit, input.committedAt, input.committedAt, input.jobId),
    prepareImportJobEventInsert(env, {
      importJobId: input.jobId,
      sourceFileId: input.job.source_file_id,
      eventType: "import_job.committed",
      statusTo: input.jobStatusAfterCommit,
      actorUserId: input.currentUserId,
      message: "Approved staged records committed.",
      createdAt: input.committedAt,
      metadata: {
        committedCount: input.committedCount,
        adapterId: input.adapter.id,
        jobStatusAfterCommit: input.jobStatusAfterCommit,
      },
    }),
    prepareAuditInsert(
      env,
      createAuditEvent({
        action: "import_job.committed",
        actor: {
          id: input.currentUserId,
          kind: "user",
        },
        subject: {
          id: input.jobId,
          kind: "import_job",
        },
        metadata: {
          sourceFileId: input.job.source_file_id,
          committedCount: input.committedCount,
          adapterId: input.adapter.id,
        },
      }),
    ),
  ];
}
