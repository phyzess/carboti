# DLQ Remediation Runbook

Status: draft
Date: 2026-06-27

This runbook is intentionally small. `qitu` does not run an automatic DLQ consumer in the starter baseline because blind replay can create retry loops. Failed imports are recovered through the existing import job state machine, permissions, and audit trail.

## When To Use This

Use this runbook when:

1. Cloudflare Queues has moved import messages to a dead-letter queue.
2. Operators see jobs stuck in `failed`, `queued`, or `processing`.
3. A deployment incident might have interrupted Queue, D1, R2, or adapter processing.

Cloudflare sends messages to a DLQ after the configured consumer retry limit is reached. Without a configured DLQ, repeatedly failing messages are discarded. A DLQ without an active consumer keeps messages for four days before deletion, so recovery should happen the same day.

Primary Cloudflare references:

1. [Dead Letter Queues](https://developers.cloudflare.com/queues/configuration/dead-letter-queues/)
2. [Configure Queues](https://developers.cloudflare.com/queues/configuration/configure-queues/)

## Quick Triage

List jobs that are failed or suspicious:

```sh
vp run ops:failed-jobs -- local
vp run ops:failed-jobs -- preview --limit 50
vp run ops:failed-jobs -- production --limit 50
```

The command is read-only. It queries D1 for import jobs with `failed`, `queued`, or `processing` status, plus any job with a recorded `failure_class`.

For direct Wrangler access, use the same query shape:

```sh
wrangler d1 execute carboti-preview --env preview --remote --command "SELECT id, status, failure_class, substr(COALESCE(failure_reason, ''), 1, 160) AS failure_reason, attempt_count, job_kind, adapter_id, source_file_id, updated_at, completed_at FROM import_jobs WHERE status IN ('failed', 'queued', 'processing') OR failure_class IS NOT NULL ORDER BY updated_at DESC LIMIT 50;"
```

## Recovery Decision

Classify each job before retrying:

| Failure class      | Recovery path                                                                   |
| ------------------ | ------------------------------------------------------------------------------- |
| `source_missing`   | Restore the R2 source object first, then retry the job.                         |
| `queue_dispatch`   | Retry after Queue availability is healthy.                                      |
| `adapter_missing`  | Deploy the adapter or mark the source unsupported; do not blind retry.          |
| `validation`       | Treat as user/data review; retry only after input data or adapter rules change. |
| `processing`       | Inspect logs and source data; retry only after the root cause is understood.    |
| unknown or missing | Inspect Worker logs, D1 job row, and source file metadata before retrying.      |

## Retry Path

Use the app retry path, not direct SQL updates:

1. Sign in as a user with `import_job:retry`.
2. Open the failed job from the import job list.
3. Review the selected job diagnostics panel for failure class, failure reason, event stream, and recovery path.
4. Use `Retry job` from the diagnostics panel or import list header.
5. Confirm `import_job.retry_queued` appears in the audit timeline.
6. Confirm the job returns to `needs_review`, `committed`, or a new classified failure.

For API-level recovery, use the same endpoint with an authenticated session:

```sh
curl -X POST "https://app.example.com/api/import-jobs/<job-id>/retry" \
  -H "Cookie: carboti_session=<session-token>"
```

Do not update `import_jobs.status` manually. Direct SQL bypasses RBAC, audit, idempotency, and Queue dispatch.

## DLQ Handling

Cloudflare DLQs are normal queues. The starter baseline configures DLQ names in `apps/worker/wrangler.jsonc`, but does not attach a DLQ consumer.

Use the Cloudflare dashboard or account tooling to inspect whether the target DLQ has messages:

| Environment | DLQ name                          |
| ----------- | --------------------------------- |
| Local       | `carboti-import-jobs-dev-dlq`        |
| Preview     | `carboti-import-jobs-preview-dlq`    |
| Production  | `carboti-import-jobs-production-dlq` |

If DLQ messages correspond to D1 jobs that are already classified as `failed`, recover through the app retry path above. If a DLQ message has no D1 job row, preserve the message payload as incident evidence and create a new tracked job through the normal upload path rather than inserting rows manually.

## Escalation

Escalate instead of retrying when:

1. The same job fails twice with the same `failure_class`.
2. R2 source content is missing and cannot be restored.
3. The adapter code changed since the source file was uploaded.
4. Worker logs show platform, binding, or permission errors.
5. The DLQ is close to its retention window.

Record the incident outcome in the audit trail or issue tracker. The kit does not prescribe a ticketing system.
