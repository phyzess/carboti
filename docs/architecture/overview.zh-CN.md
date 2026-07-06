# qitu 架构概览

Status: draft
Date: 2026-06-27

`qitu` 是一个 Cloudflare-first 全栈应用基础设施。它提供可复用的应用能力，而不是业务模型。

## 架构目标

1. 让团队可以快速启动内部数据应用。
2. 让 auth、files、jobs、review、audit、email、AI advisory、UI shell 等基础能力可复用。
3. 让业务 parser、业务数据表、业务页面和业务计算留在 app-owned feature code。
4. 通过一条真实 vertical slice 验证边界，而不是先抽象一个大框架。
5. 保持 Cloudflare 部署面尽量小。

## Runtime Shape

```text
React app
  -> same-origin /api/*
  -> Cloudflare Worker
  -> D1 / R2 / Queues / Email
```

本地开发：

1. `apps/web` 通过 Vite+ 运行 React。
2. `apps/worker` 通过 Wrangler 运行 Worker。
3. Web dev server 将 `/api` 与 `/health` proxy 到 Worker。

preview/production：

1. Worker Static Assets 托管 React build。
2. `/api/*` 和 `/health` 由 Worker 优先处理。
3. API 与 Web 同源，便于使用 HttpOnly cookie，避免早期引入 CORS 复杂度。

## Package Groups

核心 package：

1. `@carboti/auth`
2. `@carboti/rbac`
3. `@carboti/files`
4. `@carboti/jobs`
5. `@carboti/import-pipeline`
6. `@carboti/audit`
7. `@carboti/email`
8. `@carboti/ai-advisory`
9. `@carboti/charts`
10. `@carboti/ui`
11. `@carboti/design-system`
12. `@carboti/config`
13. `@carboti/testing`

App entrypoints：

1. `apps/web`
2. `apps/worker`

Boundary examples：

1. `examples/import-review`
2. `examples/json-records`

Templates：

1. `templates/app`
2. `templates/feature`

## 第一条 Vertical Slice

推荐验证路径：

```text
invite
-> accept invitation
-> login
-> upload source file
-> create import job
-> process queue
-> parse/stage records
-> human confirmation
-> AI advisory
-> approve/reject
-> commit approved records
-> audit timeline
```

该路径证明：

1. Auth 不依赖业务。
2. Files/jobs/review/audit 可以复用。
3. 业务含义只在 adapter 和 app-owned feature 里。
4. AI advisory 是建议，不自动提交。
5. 失败任务可见、可分类、可 retry。

## Cloudflare Boundaries

默认 Cloudflare 产品：

1. Workers：HTTP API、Static Assets、Queue consumer。
2. D1：关系型状态。
3. R2：source files。
4. Queues：异步 import jobs。
5. Email Sending：invite/reset delivery。

不在 baseline 中做：

1. 自动真实部署。
2. 真实账号资源 provision。
3. 自动 DLQ replay。
4. 真实 AI provider integration。

## 设计取舍

`qitu` 采用“先 slice，后抽象”的策略。一个能力进入 core，需要满足：

1. 第一条 slice 必须使用。
2. 第二个 feature 证明它不是偶然业务需求。
3. 它不会把业务含义带进 core。
4. 它能被 smoke/type/runtime/browser 验证守住。
