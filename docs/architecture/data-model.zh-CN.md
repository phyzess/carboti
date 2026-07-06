# 通用数据模型

Status: draft
Date: 2026-07-02

## 1. 目的

本文说明 `qitu` core 自己应该拥有的通用表。业务表刻意不放在这里。

通用数据模型覆盖：

1. 鉴权与会话。
2. 源文件。
3. 邮件。
4. 导入管线。
5. AI advisory。
6. 审计、安全事件与告警。

`packages/db/src/index.ts` 是 `@carboti/db` 的 package interface facade。Drizzle table definitions
按 table group 放在 package-internal focused modules 中：auth、source/import、review、AI
advisory、email 和 events。facade 继续 re-export 相同 table names；这只是实现 locality 拆分，不是
schema 或 migration 变更。

## 2. 已实现基线与目标模型

当前 migration 已实现一部分可跑通的基线：

```text
users
invitations
password_credentials
sessions
password_reset_tokens
login_attempts
source_files
email_messages
inbound_email_messages
inbound_email_attachments
import_jobs
import_job_events
import_review_issues
import_review_decisions
import_review_record_decisions
ai_advisory_artifacts
audit_events
security_events
alert_events
```

英文文档中的部分 schema 是更完整的目标模型，可能比当前 migration 更丰富。落地时以 migration 为真实结构，以本文作为边界说明。

## 3. 鉴权表

当前基线使用：

```text
users
invitations
password_credentials
sessions
password_reset_tokens
login_attempts
```

目标模型可以扩展为：

```text
users
user_identities
user_sessions
user_invitations
password_reset_tokens
login_attempts
```

核心原则：

1. `users` 保存用户、邮箱、状态、角色与激活时间。
2. 密码、邀请 token、reset token、session token 只存 hash。
3. `user_identities` 给未来 OIDC、飞书、钉钉、企业微信、SAML 留扩展空间。
4. `login_attempts` 记录登录结果，但不暴露邮箱是否存在。

默认用户状态：

```text
invited
active
suspended
disabled
```

## 4. 源文件表

`source_files` 保存文件的物理事实。当前 migration 字段为：

```sql
source_files (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  object_key TEXT NOT NULL,
  filename TEXT NOT NULL,
  content_type TEXT NOT NULL,
  size INTEGER,
  uploaded_by TEXT NOT NULL,
  uploaded_at TEXT NOT NULL,
  content_hash TEXT
)
```

D1 只保存 R2 object key 与文件元数据；具体 bucket 来自 Worker binding。core 只知道“文件是什么物理对象”。业务功能决定“这个文件是什么意思”。

## 5. 邮件表

`email_messages` 保存 invitation/password reset 的发送账本，覆盖 `store` 与 `send` 模式：

```sql
email_messages (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT NOT NULL,
  provider TEXT NOT NULL,
  provider_message_id TEXT,
  error_message TEXT,
  metadata_json TEXT,
  created_at TEXT NOT NULL,
  sent_at TEXT
)
```

原始正文应放 R2。D1 不存完整邮件正文，只存必要元数据和最小提取信息。

当前 inbound email 基线已经实现独立收件与附件表；raw RFC822 存 R2，附件会交给 source-file intake 并创建 import job：

```sql
inbound_email_messages (
  id TEXT PRIMARY KEY,
  from_email TEXT NOT NULL,
  to_email TEXT NOT NULL,
  subject TEXT,
  raw_object_key TEXT NOT NULL,
  raw_size INTEGER NOT NULL,
  attachment_count INTEGER NOT NULL,
  status TEXT NOT NULL,
  metadata_json TEXT,
  received_at TEXT NOT NULL
)

inbound_email_attachments (
  id TEXT PRIMARY KEY,
  inbound_email_id TEXT NOT NULL,
  filename TEXT NOT NULL,
  content_type TEXT NOT NULL,
  size INTEGER NOT NULL,
  source_file_id TEXT,
  import_job_id TEXT,
  object_key TEXT,
  status TEXT NOT NULL,
  error_message TEXT,
  created_at TEXT NOT NULL
)
```

## 6. 导入管线表

当前基线：

1. `import_jobs` 保存 source file、状态、adapter/job metadata、幂等 key、尝试次数和失败分类。
2. `import_review_issues`、`import_review_decisions`、`import_review_record_decisions` 属于 core，使用不透明的 `staged_record_key`。
3. `example_staged_records` 与 `example_committed_records` 是 example-owned demo 表，真实应用应替换为业务自己的 staging 与 commit 表。

推荐状态流：

```text
queued -> processing -> needs_review
needs_review -> approved
approved -> committed
approved -> needs_review (partial commit 后仍有 pending records)
queued -> processing -> failed
```

`rejected` 是 staged record status，不是当前基线的 job-level status。

导入相关表的职责：

1. `import_jobs`：作业生命周期与状态。
2. `import_job_events`：状态变化与时间线。
3. `import_review_issues`：校验问题、冲突和警告。

未来如果需要更细的解析错误明细，可以增加 `import_errors`；当前 migration 尚未实现该表。

## 7. AI Advisory 表

`ai_advisory_artifacts` 保存 AI 或本地 deterministic helper 的建议结果：

1. 关联 import job。
2. provider 与 model。
3. prompt version。
4. summary。
5. output JSON。
6. 创建者。
7. confirmed/dismissed 状态与操作者。

Advisory artifact 不是业务事实。commit 路由必须读取“已审批的 staging records”，不能读取 AI advisory 状态来直接提交业务数据。

## 8. 事件表

当前基线已经实现：

```text
audit_events
login_attempts
import_job_events
security_events
alert_events
```

`audit_events` 记录业务与系统操作。当前 migration 字段为：

```sql
audit_events (
  id TEXT PRIMARY KEY,
  action TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  actor_kind TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  subject_kind TEXT NOT NULL,
  metadata_json TEXT,
  occurred_at TEXT NOT NULL
)
```

更细的请求、安全与作业时间线事实分别进入 `login_attempts`、`security_events` 与 `import_job_events`。

`security_events` 记录安全相关事件：

1. 登录成功/失败。
2. 密码重置。
3. 权限拒绝。
4. 账号禁用或恢复。
5. session revoke。

`alert_events` 用于未来告警中心：

1. severity。
2. alert type。
3. title/message。
4. status。
5. acknowledged/resolved 信息。

## 9. 业务表

业务表不在 `qitu` core 中定义。

业务功能可以拥有：

1. staging 表。
2. 业务主表。
3. 业务历史表。
4. 计算结果表。
5. 报表或 chart 投影表。

业务表通过以下字段与 core 串联：

1. `source_file_id`
2. `import_job_id`
3. `audit_events`
4. 业务自己的 commit key
