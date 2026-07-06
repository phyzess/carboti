import type { SourceFileRow } from "./source-list-query";

export function publicSourceFile(row: SourceFileRow): Record<string, unknown> {
  return {
    id: row.id,
    workspaceId: row.workspace_id,
    objectKey: row.object_key,
    filename: row.filename,
    contentType: row.content_type,
    contentHash: row.content_hash,
    size: row.size,
    uploadedBy: row.uploaded_by,
    uploadedAt: row.uploaded_at,
  };
}
