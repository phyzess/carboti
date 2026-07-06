# DLQ 恢复 Runbook

Status: draft
Date: 2026-06-27

这个 runbook 故意保持很小。`qitu` baseline 不运行自动 DLQ consumer，因为 blind replay 可能制造 retry loop。失败 import 应通过已有 import job state machine、权限和 audit trail 恢复。

## 什么时候使用

以下场景使用本文：

1. Cloudflare Queues 已把 import messages 移入 DLQ。
2. 操作员看到 jobs 卡在 `failed`、`queued` 或 `processing`。
3. 部署事故可能中断 Queue、D1、R2 或 adapter processing。

Cloudflare 会在 consumer 达到 retry limit 后把 messages 发送到 DLQ。没有配置 DLQ 时，重复失败的 messages 会被丢弃。没有 active consumer 的 DLQ message 会保留 4 天，因此应尽量当天恢复。

Cloudflare 参考：

1. [Dead Letter Queues](https://developers.cloudflare.com/queues/configuration/dead-letter-queues/)
2. [Configure Queues](https://developers.cloudflare.com/queues/configuration/configure-queues/)

## 快速排查

列出 failed 或 suspicious jobs：

```sh
vp run ops:failed-jobs -- local
vp run ops:failed-jobs -- preview --limit 50
vp run ops:failed-jobs -- production --limit 50
```

该命令只读。它查询 D1 中 `failed`、`queued`、`processing` 状态的 import jobs，以及任何带 `failure_class` 的 job。

直接 Wrangler 查询：

```sh
wrangler d1 execute carboti-preview --env preview --remote --command "SELECT id, status, failure_class, substr(COALESCE(failure_reason, ''), 1, 160) AS failure_reason, attempt_count, job_kind, adapter_id, source_file_id, updated_at, completed_at FROM import_jobs WHERE status IN ('failed', 'queued', 'processing') OR failure_class IS NOT NULL ORDER BY updated_at DESC LIMIT 50;"
```

## 恢复判断

retry 前先分类：

| Failure class      | 恢复路径                                                                |
| ------------------ | ----------------------------------------------------------------------- |
| `source_missing`   | 先恢复 R2 source object，再 retry job。                                 |
| `queue_dispatch`   | Queue 可用性恢复后 retry。                                              |
| `adapter_missing`  | 部署 adapter 或标记 source unsupported；不要 blind retry。              |
| `validation`       | 作为用户/数据 review；只有 input data 或 adapter rules 变化后才 retry。 |
| `processing`       | 检查 logs 和 source data；理解 root cause 后再 retry。                  |
| unknown or missing | retry 前先查 Worker logs、D1 job row、source file metadata。            |

## Retry 路径

使用 app retry path，不要直接 SQL 更新：

1. 使用有 `import_job:retry` 权限的用户登录。
2. 从 import job list 打开 failed job。
3. 先查看选中 job 的 diagnostics panel，确认 failure class、failure reason、event stream 和 recovery path。
4. 在 diagnostics panel 或 import list header 中点击 `Retry job`。
5. 确认 audit timeline 出现 `import_job.retry_queued`。
6. 确认 job 进入 `needs_review`、`committed` 或新的 classified failure。

API-level recovery 使用相同 endpoint，并携带已鉴权 session：

```sh
curl -X POST "https://app.example.com/api/import-jobs/<job-id>/retry" \
  -H "Cookie: carboti_session=<session-token>"
```

不要手动更新 `import_jobs.status`。直接 SQL 会绕过 RBAC、audit、idempotency 和 Queue dispatch。

## DLQ 处理

Cloudflare DLQ 是普通 Queue。starter baseline 在 `apps/worker/wrangler.jsonc` 中配置了 DLQ 名称，但不挂 DLQ consumer。

使用 Cloudflare dashboard 或账号工具检查目标 DLQ 是否有 messages：

| Environment | DLQ name                          |
| ----------- | --------------------------------- |
| Local       | `carboti-import-jobs-dev-dlq`        |
| Preview     | `carboti-import-jobs-preview-dlq`    |
| Production  | `carboti-import-jobs-production-dlq` |

如果 DLQ message 对应的 D1 job 已分类为 `failed`，通过上面的 app retry path 恢复。若 DLQ message 没有对应 D1 job row，先保存 message payload 作为 incident evidence，再通过正常 upload path 创建新 tracked job，不要手工插入 rows。

## 升级处理

以下场景不要继续 retry，应升级：

1. 同一个 job 以相同 `failure_class` 失败两次。
2. R2 source content 缺失且无法恢复。
3. source file 上传后 adapter code 发生过变化。
4. Worker logs 显示 platform、binding 或 permission errors。
5. DLQ 接近 retention window。

incident 结果应记录到 audit trail 或 issue tracker。kit 不规定具体 ticketing system。
