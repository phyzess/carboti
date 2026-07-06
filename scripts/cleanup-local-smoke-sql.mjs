const sourceFilter = `
  filename LIKE 'browser-smoke-%'
  OR filename LIKE 'smoke-%'
  OR filename LIKE 'sample-%'
`;

const userFilter = `
  email LIKE 'reviewer-%@example.com'
  AND display_name = 'Browser Smoke'
`;

export const countSql = `
  SELECT
    (SELECT COUNT(*) FROM source_files WHERE ${sourceFilter}) AS source_files,
    (SELECT COUNT(*) FROM import_jobs WHERE source_file_id IN (
      SELECT id FROM source_files WHERE ${sourceFilter}
    )) AS import_jobs,
    (SELECT COUNT(*) FROM example_staged_records WHERE source_file_id IN (
      SELECT id FROM source_files WHERE ${sourceFilter}
    )) AS staged_records,
    (SELECT COUNT(*) FROM example_committed_records WHERE source_file_id IN (
      SELECT id FROM source_files WHERE ${sourceFilter}
    )) AS committed_records,
    (SELECT COUNT(*) FROM users WHERE ${userFilter}) AS smoke_users,
    (SELECT COUNT(*) FROM invitations WHERE email LIKE 'reviewer-%@example.com') AS smoke_invitations,
    (SELECT COUNT(*) FROM email_messages WHERE recipient_email LIKE 'reviewer-%@example.com') AS smoke_emails;
`;

export const deleteSql = `
  DELETE FROM ai_advisory_artifacts
  WHERE import_job_id IN (
    SELECT import_jobs.id
    FROM import_jobs
    INNER JOIN source_files ON source_files.id = import_jobs.source_file_id
    WHERE ${sourceFilter}
  );

  DELETE FROM import_job_events
  WHERE import_job_id IN (
    SELECT import_jobs.id
    FROM import_jobs
    INNER JOIN source_files ON source_files.id = import_jobs.source_file_id
    WHERE ${sourceFilter}
  );

  DELETE FROM import_review_record_decisions
  WHERE import_job_id IN (
    SELECT import_jobs.id
    FROM import_jobs
    INNER JOIN source_files ON source_files.id = import_jobs.source_file_id
    WHERE ${sourceFilter}
  );

  DELETE FROM import_review_decisions
  WHERE import_job_id IN (
    SELECT import_jobs.id
    FROM import_jobs
    INNER JOIN source_files ON source_files.id = import_jobs.source_file_id
    WHERE ${sourceFilter}
  );

  DELETE FROM import_review_issues
  WHERE import_job_id IN (
    SELECT import_jobs.id
    FROM import_jobs
    INNER JOIN source_files ON source_files.id = import_jobs.source_file_id
    WHERE ${sourceFilter}
  );

  DELETE FROM example_committed_records
  WHERE source_file_id IN (SELECT id FROM source_files WHERE ${sourceFilter});

  DELETE FROM example_staged_records
  WHERE source_file_id IN (SELECT id FROM source_files WHERE ${sourceFilter});

  DELETE FROM audit_events
  WHERE actor_id IN (SELECT id FROM users WHERE ${userFilter})
     OR subject_id IN (SELECT id FROM users WHERE ${userFilter})
     OR subject_id IN (SELECT id FROM source_files WHERE ${sourceFilter})
     OR subject_id IN (
       SELECT import_jobs.id
       FROM import_jobs
       INNER JOIN source_files ON source_files.id = import_jobs.source_file_id
       WHERE ${sourceFilter}
     )
     OR metadata_json LIKE '%browser-smoke-%'
     OR metadata_json LIKE '%sample-%';

  DELETE FROM import_jobs
  WHERE source_file_id IN (SELECT id FROM source_files WHERE ${sourceFilter});

  DELETE FROM source_files
  WHERE ${sourceFilter};

  DELETE FROM security_events
  WHERE actor_user_id IN (SELECT id FROM users WHERE ${userFilter})
     OR target_user_id IN (SELECT id FROM users WHERE ${userFilter})
     OR metadata_json LIKE '%reviewer-%@example.com%';

  DELETE FROM login_attempts
  WHERE user_id IN (SELECT id FROM users WHERE ${userFilter});

  DELETE FROM sessions
  WHERE user_id IN (SELECT id FROM users WHERE ${userFilter});

  DELETE FROM password_credentials
  WHERE user_id IN (SELECT id FROM users WHERE ${userFilter});

  DELETE FROM password_reset_tokens
  WHERE email LIKE 'reviewer-%@example.com'
     OR user_id IN (SELECT id FROM users WHERE ${userFilter});

  DELETE FROM email_messages
  WHERE recipient_email LIKE 'reviewer-%@example.com';

  DELETE FROM invitations
  WHERE email LIKE 'reviewer-%@example.com';

  DELETE FROM users
  WHERE ${userFilter};
`;
