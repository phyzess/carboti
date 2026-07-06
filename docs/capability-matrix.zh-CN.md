# 能力矩阵

Status: draft
Date: 2026-07-02

## 状态定义

| 状态             | 含义                                                |
| ---------------- | --------------------------------------------------- |
| Designed         | 架构与决策已记录。                                  |
| Scaffolded       | package 或 app shell 已存在。                       |
| Runnable         | 有本地命令路径。                                    |
| Verified         | 被 smoke、type、unit、integration 或 runtime 覆盖。 |
| Production-ready | 可以给真实用户使用，并有运维 runbook。              |

## 当前矩阵

| 能力                  | Designed | Scaffolded | Runnable | Verified | Production-ready | 说明                                                                                                                                                                                                                                                                                                                                          |
| --------------------- | -------- | ---------- | -------- | -------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| React app shell       | Yes      | Yes        | Yes      | Partial  | No               | 已接入 login、`/workspace` 登录落点、受保护的 Workspace 与 Settings route roots、account/logout、持久化中英文选择、成员/邀请设置入口、source/import/review/audit 页面、role-aware write controls、source/job diagnostics、import-to-review selected job context、frontend-only mock demo mode，并有 browser smoke。                           |
| Worker API shell      | Yes      | Yes        | Yes      | Partial  | No               | `apps/worker` 暴露 health/runtime primitives、HTTP source intake、inbound email intake、queue processing，并有最小 Cloudflare Vitest runtime smoke。                                                                                                                                                                                          |
| Auth                  | Yes      | Yes        | Partial  | Partial  | No               | Invite link、accept page、login、protected routing、account/logout、带 resend/revoke/delete-revoked 的 admin user/invitation management、member hard delete guards、reset page、session revocation、security events 和 audit 已集成。                                                                                                         |
| RBAC                  | Yes      | Partial    | Partial  | Partial  | No               | `@carboti/rbac` 定义 owner/admin/reviewer/viewer；Worker 写路由检查权限并写 audit/security-event `rbac.denied`；React shell 会把 viewer 写权限呈现为 read-only controls；多租户 scope 仍是未来工作。                                                                                                                                             |
| Files                 | Yes      | Yes        | Partial  | Partial  | No               | 鉴权上传与 inbound email attachment intake 会写 R2/D1/audit；source list API 和 upload UI 已接 Worker API，source rows 会显示相关 import job 状态与 hash。                                                                                                                                                                                    |
| Jobs                  | Yes      | Partial    | Partial  | Partial  | No               | 上传创建 queued import job；handler/local drain 推进 processing/needs_review/failed；failed jobs 可列出、retry、通过 failure class/reason 诊断、映射到页面内 recovery guidance，并通过 `import_job_events` 追踪。                                                                                                                             |
| Import pipeline       | Yes      | Partial    | Partial  | Partial  | No               | Worker 注册 app-owned text 和 JSON starter adapters；queue 使用 adapter parse/stage/validate；非法数字停留在 review；commit 使用 `commitApproved`。                                                                                                                                                                                           |
| Human review          | Yes      | Partial    | Partial  | Partial  | No               | Review/decision/commit/retry API 和 API-backed demo console 已存在；handler 与 browser smoke 覆盖 approve、commit、reject。                                                                                                                                                                                                                   |
| Audit/security/alerts | Yes      | Partial    | Partial  | Partial  | No               | 敏感路径写 audit，包括 invitation lifecycle events；login attempts、security events、import job events、alert events、list API、server-backed audit filters 与 web timeline/detail views 已接入。                                                                                                                                             |
| Email                 | Yes      | Partial    | Partial  | Partial  | No               | Invitation/reset templates、`store` 与 `send` delivery modes、`email_messages` delivery ledger、可见 failed invite delivery 与 resend、Cloudflare `send_email`、React token landing pages、business-neutral inbound email handling 已接入。                                                                                                   |
| AI advisory           | Yes      | Partial    | Partial  | Partial  | No               | 本地 deterministic import-review advisory artifacts、list/generate/confirm/dismiss routes、web panel、audit events，以及 generate/confirm 的 browser smoke 覆盖已接入。                                                                                                                                                                       |
| Charts                | Yes      | Yes        | Partial  | Partial  | No               | `@carboti/charts` 暴露暗色、token-driven 的 visx chart primitives，并支持 loading/empty/error/partial 状态。                                                                                                                                                                                                                                     |
| Design system         | Yes      | Yes        | Yes      | Partial  | No               | 已实现 qitu business-neutral workbench tokens、shell、surfaces、metrics、data states、timeline 与 review console composition。                                                                                                                                                                                                                |
| Internationalization  | Yes      | Yes        | Yes      | Partial  | No               | `@carboti/i18n` 提供 reusable locale primitives、plural/relative-time helpers 和 locale negotiation；`apps/web`、Worker auth routes 与 email templates 拥有各自 dictionaries 与 selection UX。                                                                                                                                                   |
| Feature templates     | Yes      | Yes        | Yes      | Partial  | No               | `templates/app` 有 verified copy manifest 和 adoption commands；`templates/feature` 是 typechecked copyable adapter，带 migration、fixture、web-surface 与 registry replacement slots。                                                                                                                                                       |
| Agent docs            | Yes      | Yes        | N/A      | Partial  | No               | Codex、Claude Code、Pi entrypoints 已存在。                                                                                                                                                                                                                                                                                                   |
| Cloudflare deployment | Yes      | Partial    | Partial  | Partial  | No               | Cloudflare Pages 静态 demo 命令已接入，用于 frontend-only review；local/preview/production binding stubs 已存在；dry-run preflight 检查 public origins、Email Sending config、D1 placeholders、static assets 和 queue DLQ；DLQ remediation、email deliverability 与 deployment runbooks 已接入；尚未 provision 真实 preview/production 账号。 |

## 近期验证目标

按优先级增加验证：

1. Template invariant 的 static smoke checks。
2. 使用 local D1/R2/Queue fakes 的 Worker handler integration。
3. TypeScript 7 RC package type checks。
4. 超出当前最小 runtime smoke 的 Cloudflare Email Service、Queues、D1、R2 binding runtime tests。
5. 只有当新真实 adapter 带来 parser-specific risk 时，才增加更广的 adapter edge-case tests。

## Production Readiness Gate

某项能力只有满足以下条件才算 production-ready：

1. 有覆盖成功与失败路径的测试。
2. 敏感操作写 audit events。
3. 相关场景有 rate limit 或 abuse control。
4. 有运维恢复路径。
5. 不依赖 AI output 自动提交，必须有人确认。
6. Cloudflare bindings 与 secrets 已记录。
