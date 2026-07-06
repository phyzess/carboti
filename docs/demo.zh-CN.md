# 静态 Demo

Status: draft
Date: 2026-07-06

`qitu` demo 是一个只依赖前端的展示环境，用来评审可复用 app shell 和第一条 vertical
slice 的产品形态。它适合分享、走查和讨论，不要求先 provision 真实 Cloudflare 资源。

## 边界

Demo 不是 preview。

| 环境         | 托管形态                  | API/data 行为                                     | 用途           |
| ------------ | ------------------------- | ------------------------------------------------- | -------------- |
| `demo`       | Cloudflare Pages 静态 app | 浏览器本地 mock API 与 fixtures                   | 展示和流程走查 |
| `preview`    | Worker Static Assets      | 真实 Worker，接 D1、R2、Queue 和 Cloudflare Email | 发布验证       |
| `production` | Worker Static Assets      | 真实 Worker，接 production Cloudflare resources   | 真实 operator  |

Demo build 设置 `VITE_QITU_API_MODE=mock`。在这个模式下，`apps/web/src/api-client.ts` 会加载
`apps/web/src/mock-api.ts`，不会访问 `/api/*` 或 `/health`。Mock API entrypoint 只是薄 route
composer；auth、invitation、workspace、import-job、review、advisory、source upload、model、seed 和
audit 行为分别放在 focused `mock-api-*-routes.ts`、`mock-api-*-operations.ts`、`mock-api-seed-*`
以及 model/helper modules 中。Mock state 存在浏览器 `localStorage`；不会使用 Worker、D1、R2、Queue、
Email Sending、Email Routing 或 secrets。

## 本地 Demo

不启动 Worker，只跑 demo：

```sh
vp run dev:demo
```

构建静态 demo：

```sh
vp run build:demo
```

构建输出在 `apps/web/dist`。`apps/web/public/_redirects` 会复制进构建产物，让 Cloudflare Pages
可以处理 `/workspace/reviews`、`/invite/*` 和 `/reset-password/*` 这类 TanStack Router 深链。

Demo 默认进入浏览器本地 admin 会话：

```text
admin@example.com
correct horse battery staple
```

如果用户退出登录，同一组凭据会被预填。Mock login 只操作浏览器本地 demo account，不会请求服务端。

如需重置本地 demo state，可以清除当前 origin 的站点数据，或在浏览器控制台执行：

```js
localStorage.removeItem("qitu.demo.mockState.v1");
location.reload();
```

## Cloudflare Pages

推荐给 demo 单独建一个 Cloudflare Pages project，例如：

```text
qitu-demo
demo.qitu.dev
```

Direct upload 部署：

```sh
vp run deploy:demo
```

如果 Pages project 还不存在，第一次部署前先创建一次：

```sh
vp exec wrangler pages project create qitu-demo --production-branch main
```

默认值：

| 设置         | 默认值      | 覆盖方式                  |
| ------------ | ----------- | ------------------------- |
| Project name | `qitu-demo` | `QITU_DEMO_PAGES_PROJECT` |
| Branch       | `main`      | `QITU_DEMO_PAGES_BRANCH`  |

等价显式命令：

```sh
vp run deploy:demo -- --project-name qitu-demo --branch main
```

部署脚本会：

1. 使用 `VITE_QITU_API_MODE=mock` 构建。
2. 运行 `wrangler whoami` 确认 Cloudflare 登录状态。
3. 使用 `--commit-dirty=true` 运行 `wrangler pages deploy apps/web/dist`，适配 direct upload build。

如果使用 Git-based Pages 部署，Pages project 配置为：

| 字段           | 值                  |
| -------------- | ------------------- |
| Root directory | repository root     |
| Build command  | `vp run build:demo` |
| Build output   | `apps/web/dist`     |

不要给 demo project 添加 D1、R2、Queue、Email 或 secret bindings。如果未来 demo 需要少量服务端行为，
应在明确 mock-only 边界下添加 Pages Functions，不要复用 Worker `preview` 环境。

## 内置 Fixtures

浏览器本地 mock 包含：

1. Admin、operator 和 viewer 用户。
2. 待处理与失败的邀请投递记录。
3. 带 content hash 的 source files。
4. `needs_review`、`approved` 和 `failed` 状态的 import jobs。
5. Staged records、review issues、确认、排除和 commit 操作。
6. Mock AI advisory 生成、确认与忽略。
7. Audit 与 import-job event streams。

所有 mutation 都只存在浏览器 storage 中，可以随时重置。
