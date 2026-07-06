export type SourceFileRow = {
  id: string;
  workspace_id: string;
  object_key: string;
  filename: string;
  content_type: string;
  content_hash: string | null;
  size: number | null;
  uploaded_by: string;
  uploaded_at: string;
};

export async function readSourceFiles(
  env: Env,
  input: {
    limit: number;
    workspaceId: string;
  },
): Promise<SourceFileRow[]> {
  const result = await env.DB.prepare(
    `
      SELECT
        id,
        workspace_id,
        object_key,
        filename,
        content_type,
        content_hash,
        size,
        uploaded_by,
        uploaded_at
      FROM source_files
      WHERE workspace_id = ?
      ORDER BY uploaded_at DESC
      LIMIT ?
    `,
  )
    .bind(input.workspaceId, input.limit)
    .all<SourceFileRow>();

  return result.results;
}
