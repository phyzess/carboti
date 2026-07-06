export type ImportJobReviewRow = {
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

export type ImportReviewIssueRow = {
  id: string;
  import_job_id: string;
  staged_record_key: string;
  code: string;
  message: string;
  severity: string;
  status: string;
  created_at: string;
};
