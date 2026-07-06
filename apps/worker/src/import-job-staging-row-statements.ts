import { createAuditEvent } from "@carboti/audit";
import type { ReviewIssue } from "@carboti/import-pipeline";
import { prepareAuditInsert } from "./audit-store";
import type { WorkerImportAdapter } from "./import-adapters";

export type StagedImportRow = {
  id: string;
  issues: ReviewIssue[];
  payloadJson: string;
  sourceRowKey: string;
  stagedRecordKey: string;
};

export function prepareStagedImportRowStatements(
  env: Env,
  input: {
    adapter: WorkerImportAdapter;
    importJobId: string;
    row: StagedImportRow;
    sourceFileId: string;
    stagedAt: string;
  },
): D1PreparedStatement[] {
  const { adapter, importJobId, row, sourceFileId, stagedAt } = input;

  return [
    adapter.reviewStore.prepareInsertStagedRecord(env, {
      id: row.id,
      importJobId,
      sourceFileId,
      stagedRecordKey: row.stagedRecordKey,
      sourceRowKey: row.sourceRowKey,
      payloadJson: row.payloadJson,
      reviewStatus: "pending",
      createdAt: stagedAt,
      updatedAt: stagedAt,
    }),
    ...row.issues.map((issue) =>
      env.DB.prepare(
        `
          INSERT OR IGNORE INTO import_review_issues (
            id,
            import_job_id,
            staged_record_key,
            code,
            message,
            severity,
            status,
            created_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
      ).bind(
        crypto.randomUUID(),
        importJobId,
        row.stagedRecordKey,
        issue.code,
        issue.message,
        issue.severity,
        "open",
        stagedAt,
      ),
    ),
    prepareAuditInsert(
      env,
      createAuditEvent({
        action: "import_review.record_staged",
        actor: {
          id: "queue",
          kind: "system",
        },
        subject: {
          id: row.id,
          kind: adapter.reviewStore.stagedRecordSubjectKind,
        },
        metadata: {
          importJobId,
          sourceFileId,
          stagedRecordKey: row.stagedRecordKey,
          adapterId: adapter.id,
        },
      }),
    ),
  ];
}
