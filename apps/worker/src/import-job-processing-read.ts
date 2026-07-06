export type ImportProcessingJobRow = {
  id: string;
  source_file_id: string;
  status: string;
  job_kind: string | null;
  adapter_id: string | null;
  failure_reason: string | null;
  failure_class: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  filename: string;
  content_type: string;
  object_key: string;
};

export async function readImportProcessingJob(
  env: Env,
  jobId: string,
): Promise<ImportProcessingJobRow | null> {
  return env.DB.prepare(
    `
      SELECT
        import_jobs.id,
        import_jobs.source_file_id,
        import_jobs.status,
        import_jobs.job_kind,
        import_jobs.adapter_id,
        import_jobs.failure_reason,
        import_jobs.failure_class,
        import_jobs.created_by,
        import_jobs.created_at,
        import_jobs.updated_at,
        import_jobs.completed_at,
        source_files.filename,
        source_files.content_type,
        source_files.object_key
      FROM import_jobs
      INNER JOIN source_files ON source_files.id = import_jobs.source_file_id
      WHERE import_jobs.id = ?
      LIMIT 1
    `,
  )
    .bind(jobId)
    .first<ImportProcessingJobRow>();
}
