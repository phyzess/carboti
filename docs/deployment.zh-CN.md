# Cloudflare 部署准备

Status: draft
Date: 2026-06-27

本文用于准备真实 Cloudflare account。它不会自动部署，因为 account IDs、resource IDs、verified senders 和最终 hostnames 都是环境相关的。

## 1. 静态 Demo

前端静态 demo 部署到单独的 Cloudflare Pages project，不需要 Worker bindings、D1、R2、Queue、Email
或 secrets：

```sh
vp run build:demo
vp exec wrangler pages project create qitu-demo --production-branch main
vp run deploy:demo
```

Demo build 设置 `VITE_QITU_API_MODE=mock`，服务 `apps/web/dist`，fixture state 存在浏览器
`localStorage`。它只用于视觉评审和流程走查，不作为 Worker-backed 行为的发布 gate。

推荐 Pages 形态：

| 字段          | 值                  |
| ------------- | ------------------- |
| Project name  | `qitu-demo`         |
| Build command | `vp run build:demo` |
| Build output  | `apps/web/dist`     |
| Bindings      | 无                  |

完整边界和重置方式见 `docs/demo.zh-CN.md`。

## 2. Dry Run

触碰远端资源前，先执行 Worker bundle dry-run：

```sh
vp run deploy:dry-run
```

Preview 和 production dry-runs 会先 build web app，再验证 Worker + Static Assets bundle；远端目标 dry-run 会先运行 `wrangler whoami` 确认 Cloudflare 登录状态：

```sh
vp run deploy:preview:dry-run
vp run deploy:production:dry-run
```

`apps/worker/wrangler.jsonc` 在 preview/production 中使用 Worker Static Assets 托管 React build。`/api/*` 与 `/health` 仍然优先走 Worker，所以 web app 可以继续使用相对 API URL 和 HttpOnly cookies。

## 3. 所需资源

Worker 需要：

| Binding        | Product | Local name                 | Preview name                   | Production name                   |
| -------------- | ------- | -------------------------- | ------------------------------ | --------------------------------- |
| `DB`           | D1      | `carboti-dev`                 | `carboti-preview`                 | `carboti-production`                 |
| `SOURCE_FILES` | R2      | `carboti-source-files-dev`    | `carboti-source-files-preview`    | `carboti-source-files-production`    |
| `IMPORT_JOBS`  | Queues  | `carboti-import-jobs-dev`     | `carboti-import-jobs-preview`     | `carboti-import-jobs-production`     |
| DLQ            | Queues  | `carboti-import-jobs-dev-dlq` | `carboti-import-jobs-preview-dlq` | `carboti-import-jobs-production-dlq` |
| `EMAIL`        | Email   | local metadata only        | Cloudflare Email Sending       | Cloudflare Email Sending          |

创建远端资源：

```sh
wrangler d1 create carboti-preview
wrangler r2 bucket create carboti-source-files-preview
wrangler queues create carboti-import-jobs-preview
wrangler queues create carboti-import-jobs-preview-dlq
wrangler d1 create carboti-production
wrangler r2 bucket create carboti-source-files-production
wrangler queues create carboti-import-jobs-production
wrangler queues create carboti-import-jobs-production-dlq
```

然后在远端 migration 或 deploy 前，替换 `apps/worker/wrangler.jsonc` 中的 `REPLACE_WITH_PREVIEW_D1_DATABASE_ID` 和 `REPLACE_WITH_PRODUCTION_D1_DATABASE_ID`。

Cloudflare Email Service 在 local 之外需要 verified sender。目标环境的 `MAIL_FROM` 必须是已验证地址，`PUBLIC_APP_URL` 必须匹配部署后的 web origin。

## 4. Secrets

当前 baseline 使用 deterministic local AI advisory generation，不需要 model-provider secrets。未来 provider adapters 应通过 Wrangler 或 Cloudflare dashboard 设置 secrets：

```sh
wrangler secret put PROVIDER_API_KEY --env preview
wrangler secret put PROVIDER_API_KEY --env production
```

不要把 secret values 提交到 `.env`、`apps/worker/.dev.vars`、docs 或
`apps/worker/wrangler.jsonc`。

`EMAIL_DELIVERY_MODE`、`MAIL_FROM`、`MAIL_REPLY_TO`、`PUBLIC_APP_NAME` 和 `PUBLIC_APP_URL`
是配置值，不是 secrets，但部署前仍需按环境 review。

## 5. Remote Migration

资源 ID 配好后：

```sh
vp run db:migrate:preview
vp run db:migrate:production
```

远端 migration 必须显式执行并 review，不要隐藏在默认本地 setup 里。

执行后检查 migration list 和至少一个预期表：

```sh
wrangler d1 migrations list carboti-preview --env preview --remote
wrangler d1 execute carboti-preview --env preview --remote --command "SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name;"
```

## 6. Deployment Gate

真实部署前：

1. 运行 `vp run verify:kit`。
2. 运行 `vp run deploy:dry-run`。
3. 运行目标环境 dry-run：`vp run deploy:preview:dry-run` 或 `vp run deploy:production:dry-run`。
4. 确认远端 resource IDs 不是 placeholder。
5. 确认 `PUBLIC_APP_URL` 匹配部署 web origin。
6. 如果启用真实 AI provider，确认 provider secrets 存在。
7. 确认 `MAIL_FROM` 是 verified Cloudflare Email sender。
8. 确认 invitation bootstrap routes 在 `APP_ENV=local` 之外禁用。
9. 确认目标 Queue 有 DLQ。
10. 对目标环境运行 failed-job snapshot。
11. 确认 `wrangler whoami` 指向预期 Cloudflare account。
12. 目标 deploy 成功后确认输出 Worker version id，并验证 `/health`。

```sh
vp run ops:failed-jobs -- preview --limit 50
vp run ops:failed-jobs -- production --limit 50
```

## 7. DLQ 与失败任务恢复

当 Queue messages 进入 DLQ 或 import jobs 卡住时，使用 `docs/operations/dlq-remediation.zh-CN.md`。

Baseline 恢复路径故意是人工的：

1. 用 `vp run ops:failed-jobs` 检查 failed/suspicious jobs。
2. retry 前先恢复缺失的 R2 source object 或部署缺失 adapter。
3. 通过 app/API retry，保留 RBAC、audit、idempotency 和 Queue dispatch。
4. 重复失败时升级处理，不要 blind replay DLQ messages。

Starter 不挂自动 DLQ consumer。只有真实生产 Queue 证明人工恢复不够时，才增加自动化。

## 8. Known Gaps

生产使用前仍需：

1. Auth、email、upload、queue、D1、R2、audit 的更多 runtime integration tests。
2. 部署自动化或 infrastructure-as-code 路径。
