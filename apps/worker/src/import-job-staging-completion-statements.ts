import { createAuditEvent } from "@carboti/audit";
import { prepareAuditInsert } from "./audit-store";
import type { WorkerImportAdapter } from "./import-adapters";
import { prepareImportJobEventInsert } from "./import-job-event-store";

export function prepareImportJobNeedsReviewStatements(
  env: Env,
  input: {
    adapter: WorkerImportAdapter;
    importJobId: string;
    objectKey: string;
    sourceFileId: string;
    stagedAt: string;
    stagedCount: number;
  },
): D1PreparedStatement[] {
  return [
    env.DB.prepare(
      `
        UPDATE import_jobs
        SET status = 'needs_review', completed_at = ?, updated_at = ?
        WHERE id = ?
      `,
    ).bind(input.stagedAt, input.stagedAt, input.importJobId),
    prepareImportJobEventInsert(env, {
      importJobId: input.importJobId,
      sourceFileId: input.sourceFileId,
      eventType: "import_job.needs_review",
      statusFrom: "processing",
      statusTo: "needs_review",
      message: "Import job is ready for human confirmation.",
      createdAt: input.stagedAt,
      metadata: {
        objectKey: input.objectKey,
        adapterId: input.adapter.id,
        stagedCount: input.stagedCount,
      },
    }),
    prepareAuditInsert(
      env,
      createAuditEvent({
        action: "import_job.needs_review",
        actor: {
          id: "queue",
          kind: "system",
        },
        subject: {
          id: input.importJobId,
          kind: "import_job",
        },
        metadata: {
          sourceFileId: input.sourceFileId,
          objectKey: input.objectKey,
          adapterId: input.adapter.id,
          stagedCount: input.stagedCount,
        },
      }),
    ),
  ];
}
