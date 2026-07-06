export type ImportJobListRow = {
  id: string;
  source_file_id: string;
  status: string;
  job_kind: string | null;
  adapter_id: string | null;
  attempt_count: number | null;
  failure_reason: string | null;
  failure_class: string | null;
  processing_started_at: string | null;
  completed_at: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  filename: string;
  content_type: string;
  workspace_id: string;
};

export async function readImportJobList(
  env: Env,
  input: {
    limit: number;
    status: string | null;
    workspaceId: string;
  },
): Promise<ImportJobListRow[]> {
  const result = await env.DB.prepare(
    `
      SELECT
        import_jobs.id,
        import_jobs.source_file_id,
        import_jobs.status,
        import_jobs.job_kind,
        import_jobs.adapter_id,
        import_jobs.attempt_count,
        import_jobs.failure_reason,
        import_jobs.failure_class,
        import_jobs.processing_started_at,
        import_jobs.completed_at,
        import_jobs.created_by,
        import_jobs.created_at,
        import_jobs.updated_at,
        source_files.filename,
        source_files.content_type,
        source_files.workspace_id
      FROM import_jobs
      INNER JOIN source_files ON source_files.id = import_jobs.source_file_id
      WHERE source_files.workspace_id = ?
        AND (? IS NULL OR import_jobs.status = ?)
      ORDER BY import_jobs.created_at DESC
      LIMIT ?
    `,
  )
    .bind(input.workspaceId, input.status, input.status, input.limit)
    .all<ImportJobListRow>();

  return result.results;
}
