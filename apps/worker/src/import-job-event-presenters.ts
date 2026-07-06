import type { ImportJobEventRow } from "./import-job-event-queries";

export function publicImportJobEvent(row: ImportJobEventRow): Record<string, unknown> {
  return {
    id: row.id,
    importJobId: row.import_job_id,
    sourceFileId: row.source_file_id,
    eventType: row.event_type,
    statusFrom: row.status_from,
    statusTo: row.status_to,
    actorUserId: row.actor_user_id,
    message: row.message,
    metadata: row.metadata_json ? JSON.parse(row.metadata_json) : {},
    requestId: row.request_id,
    createdAt: row.created_at,
  };
}
