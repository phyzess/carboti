import type { ImportJobListRow } from "./import-job-list-query";

export function publicImportJobListItem(row: ImportJobListRow): Record<string, unknown> {
  return {
    id: row.id,
    sourceFileId: row.source_file_id,
    status: row.status,
    jobKind: row.job_kind,
    adapterId: row.adapter_id,
    attemptCount: row.attempt_count ?? 0,
    failureReason: row.failure_reason,
    failureClass: row.failure_class,
    processingStartedAt: row.processing_started_at,
    completedAt: row.completed_at,
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    sourceFile: {
      filename: row.filename,
      contentType: row.content_type,
      workspaceId: row.workspace_id,
    },
  };
}
