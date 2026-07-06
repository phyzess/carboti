export const starterStagedRecordSelect = `
  SELECT
    id,
    import_job_id,
    source_file_id,
    staged_record_key,
    source_row_key,
    payload_json,
    review_status,
    committed_record_id,
    created_at,
    updated_at
  FROM example_staged_records
`;
