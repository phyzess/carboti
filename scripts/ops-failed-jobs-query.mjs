export function buildFailedJobsQuery(limit) {
  return `
    SELECT
      id,
      status,
      failure_class,
      substr(COALESCE(failure_reason, ''), 1, 160) AS failure_reason,
      attempt_count,
      job_kind,
      adapter_id,
      source_file_id,
      updated_at,
      completed_at
    FROM import_jobs
    WHERE status IN ('failed', 'queued', 'processing')
       OR failure_class IS NOT NULL
    ORDER BY updated_at DESC
    LIMIT ${limit};
  `
    .trim()
    .replace(/\s+/g, " ");
}
