# 本地设置

Status: draft
Date: 2026-06-27

这是 fresh `qitu` checkout 的默认启动路径。

## 1. 前置条件

推荐：

1. Node.js 24+。
2. Vite+ CLI：`vp`。
3. Wrangler，由 workspace dependency 提供。
4. Chromium，仅浏览器 smoke 首次运行时需要安装。

不要在项目里提交 registry token、Cloudflare token 或 provider secret。

## 2. 安装

```sh
vp run setup
```

该命令会：

1. 执行 `vp install`。
2. 运行 `scripts/setup-local.mjs`。
3. 检查本地 env 示例。
4. 检查 template manifest。
5. 检查关键 workspace 文件。
6. 运行 `doctor`。
7. 运行 `smoke`。

如果公司网络阻断 npm registry，先看 `docs/troubleshooting.md`。

## 3. 本地环境文件

复制示例文件：

```sh
cp .env.example .env
cp apps/worker/.dev.vars.example apps/worker/.dev.vars
```

`.env` 和 `apps/worker/.dev.vars` 不应提交。

## 4. Cloudflare 本地绑定

本地 baseline 使用这些资源名：

| Binding        | 产品  | 本地名                  |
| -------------- | ----- | ----------------------- |
| `DB`           | D1    | `carboti-dev`              |
| `SOURCE_FILES` | R2    | `carboti-source-files-dev` |
| `IMPORT_JOBS`  | Queue | `carboti-import-jobs-dev`  |
| `EMAIL`        | Email | local metadata only     |

常用配置：

| 变量              | 默认值                  | 用途                          |
| ----------------- | ----------------------- | ----------------------------- |
| `APP_ENV`         | `local`                 | 区分 local/preview/production |
| `PUBLIC_APP_NAME` | `carboti`               | auth emails 中显示的 app 名   |
| `PUBLIC_APP_URL`  | `http://localhost:5173` | 生成 invite/reset URL         |
| `MAIL_FROM`       | `noreply@example.com`   | 非本地 email sender 占位      |

## 5. 数据库 migration

本地应用 migration：

```sh
vp run db:migrate:local
```

远端 migration 是显式操作：

```sh
vp run db:migrate:preview
vp run db:migrate:production
```

远端执行前必须先在 `apps/worker/wrangler.jsonc` 中替换 D1 database ID placeholder。

## 6. 本地开发

启动完整本地栈：

```sh
vp run dev
```

该命令会自动选择可用本地端口，同时启动 Web app 和 Worker API，并打印两个 URL。默认本地开发应使用它，因为 Web app 会把 `/api` 和 `/health` 代理到 wrapper 选中的同一个 Worker origin。

如果你明确已经单独运行或 mock Worker，可以只启动 Web app：

```sh
vp run dev:web
```

只启动 Worker：

```sh
vp run dev:worker
```

显式别名也仍然可用：

```sh
vp run dev:all
```

`dev` 和 `dev:all` 使用同一个很小的 Node wrapper，同时启动 web 和 Worker dev servers，动态分配端口，传递匹配的 `QITU_WORKER_ORIGIN` / `QITU_PUBLIC_APP_URL`，并给输出加进程前缀。需要固定端口时，可设置 `QITU_WEB_PORT` 或 `QITU_WORKER_PORT`。

如果只需要一个可分享的前端静态 walkthrough，不启动 Worker，也不需要 D1、R2、Queue、Email 或 secrets：

```sh
vp run dev:demo
vp run build:demo
```

Demo 使用 `VITE_QITU_API_MODE=mock` 和浏览器本地 fixtures。详见 `docs/demo.zh-CN.md`。

本地 auth 提供可重复使用的 demo users：

```text
email: reviewer@example.com
email: admin@example.com
password: correct horse battery staple
```

在全新的本地 D1 数据库上，可通过 `Setup` tab 创建或重置 local-only reviewer/admin 账号并登录。之后同一组凭据可通过 `Login` tab 登录。reviewer 账号用于体验 review workflow，admin 账号用于体验成员与邀请设置。bootstrap routes 在 `APP_ENV=local` 之外会禁用。

## 7. 验证

快速静态验证：

```sh
vp run smoke
```

第一条 vertical slice 的浏览器验证：

```sh
vp run smoke:browser
```

如果机器第一次使用 Playwright，先安装 Chromium：

```sh
vp exec playwright install chromium
```

完整验证：

```sh
vp run validate
```

Kit 验证：

```sh
vp run verify:kit
```

`validate` 包含：

1. Static smoke checks。
2. Workspace type checks。
3. Vite+ checks。
4. Workspace builds。

Worker runtime validation：

```sh
vp run test:worker-runtime
```

该命令使用官方 Cloudflare Vitest pool。baseline 故意很小，目前只验证 `/health` 和未登录上传被拒绝，以确认 Workers runtime wiring。

`verify:kit` 会运行 `validate`、Worker runtime tests、本地 D1 migrations 和 browser smoke。宣称 kit milestone 完成前应该跑它。

## 8. 运维

只读列出失败或可疑 import jobs：

```sh
vp run ops:failed-jobs -- local
vp run ops:failed-jobs -- preview --limit 50
vp run ops:failed-jobs -- production --limit 50
```

DLQ triage 和 retry 规则见 `docs/operations/dlq-remediation.zh-CN.md`。重试应走 app/API，不要直接改 SQL。

## 9. 第一条 Feature

从 `docs/guides/first-vertical-slice.md` 开始。

使用 `templates/feature` 作为可复制 skeleton。业务含义应留在 app-owned feature code，不要进入 reusable core packages。
