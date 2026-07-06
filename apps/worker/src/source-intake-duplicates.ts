export type DuplicateSourceFileRow = {
  source_file_id: string;
  object_key: string;
  import_job_id: string | null;
  status: string | null;
};

export async function findDuplicateSourceFile(
  env: Env,
  input: {
    contentHash: string;
    workspaceId: string;
  },
): Promise<DuplicateSourceFileRow | null> {
  return env.DB.prepare(
    `
      SELECT
        source_files.id AS source_file_id,
        source_files.object_key,
        import_jobs.id AS import_job_id,
        import_jobs.status
      FROM source_files
      LEFT JOIN import_jobs ON import_jobs.source_file_id = source_files.id
      WHERE source_files.workspace_id = ? AND source_files.content_hash = ?
      ORDER BY source_files.uploaded_at DESC
      LIMIT 1
    `,
  )
    .bind(input.workspaceId, input.contentHash)
    .first<DuplicateSourceFileRow>();
}
