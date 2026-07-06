import { createAuditEvent } from "@carboti/audit";
import { prepareAuditInsert } from "./audit-store";
import type { WorkerImportAdapter } from "./import-adapters";
import type { CommittedRecordPair } from "./import-review-commit-types";

export function prepareCommittedRecordStatements(
  env: Env,
  input: {
    adapter: WorkerImportAdapter;
    committedAt: string;
    currentUserId: string;
    jobId: string;
    pair: CommittedRecordPair;
  },
): D1PreparedStatement[] {
  const { committedRecord, record } = input.pair;

  return [
    input.adapter.reviewStore.prepareInsertCommittedRecord(env, {
      id: committedRecord.id,
      record,
      payloadJson: committedRecord.payload_json,
      committedBy: input.currentUserId,
      committedAt: input.committedAt,
    }),
    input.adapter.reviewStore.prepareMarkStagedRecordCommitted(env, {
      id: record.id,
      committedRecordId: committedRecord.id,
      updatedAt: input.committedAt,
    }),
    prepareAuditInsert(
      env,
      createAuditEvent({
        action: "import_review.record_committed",
        actor: {
          id: input.currentUserId,
          kind: "user",
        },
        subject: {
          id: record.id,
          kind: input.adapter.reviewStore.stagedRecordSubjectKind,
        },
        metadata: {
          importJobId: input.jobId,
          stagedRecordKey: record.staged_record_key,
          committedRecordId: committedRecord.id,
          adapterId: input.adapter.id,
        },
      }),
    ),
  ];
}
