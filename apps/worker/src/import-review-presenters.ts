import type { ImportJobReviewRow, ImportReviewIssueRow } from "./import-review-row-types";
import type { StoredCommittedRecordRow, StoredStagedRecordRow } from "./import-review-store";

export function publicImportJobReview(row: ImportJobReviewRow): Record<string, unknown> {
  return {
    id: row.id,
    sourceFileId: row.source_file_id,
    status: row.status,
    jobKind: row.job_kind,
    adapterId: row.adapter_id,
    failureReason: row.failure_reason,
    failureClass: row.failure_class,
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    completedAt: row.completed_at,
    sourceFile: {
      filename: row.filename,
      contentType: row.content_type,
      objectKey: row.object_key,
    },
  };
}

export function publicStagedRecord(row: StoredStagedRecordRow): Record<string, unknown> {
  return {
    id: row.id,
    importJobId: row.import_job_id,
    sourceFileId: row.source_file_id,
    stagedRecordKey: row.staged_record_key,
    sourceRowKey: row.source_row_key,
    payload: parseJsonValue(row.payload_json),
    reviewStatus: row.review_status,
    committedRecordId: row.committed_record_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function publicCommittedRecord(row: StoredCommittedRecordRow): Record<string, unknown> {
  return {
    id: row.id,
    importJobId: row.import_job_id,
    sourceFileId: row.source_file_id,
    stagedRecordKey: row.staged_record_key,
    payload: parseJsonValue(row.payload_json),
    committedBy: row.committed_by,
    committedAt: row.committed_at,
  };
}

export function publicImportReviewIssue(row: ImportReviewIssueRow): Record<string, string> {
  return {
    id: row.id,
    importJobId: row.import_job_id,
    stagedRecordKey: row.staged_record_key,
    code: row.code,
    message: row.message,
    severity: row.severity,
    status: row.status,
    createdAt: row.created_at,
  };
}

export function parseJsonValue(value: string): unknown {
  return JSON.parse(value);
}
