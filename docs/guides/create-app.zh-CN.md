# 创建应用

本文说明从 `qitu` 创建新应用的当前手动流程与未来 CLI 方向。

当前仓库是 runnable kit baseline。专用 CLI 出现前，`templates/app/manifest.json` 是创建新 app repo 的权威复制清单。

## 1. 输入

创建应用前先确定：

1. App name。
2. 第一个业务 feature name。
3. 部署环境名称。
4. Auth policy。
5. File retention policy。
6. 是否开启 inbound email。
7. 是否开启 AI advisory。

## 2. 未来 CLI

理想命令：

```text
qitu create app <app-name>
```

预期输出：

```text
apps/web
apps/worker
packages/*
templates/*
examples/import-review
examples/json-records
```

生成后的 app 可以把业务代码放在 `apps/*/src/features/*`、app-local route folder，或未来可移植 feature/module layout。`qitu` 不应在真实 app 证明需要前强制顶层业务目录。

## 3. CLI 前的手动流程

1. 阅读 `templates/app/manifest.json`。
2. 复制 `manifest.json.copy` 列出的所有路径。
3. 按需要保留或删除 `manifest.json.optionalExamples`。
4. 按 `manifest.json.renameAfterCopy` 修改 public app metadata、Worker name 和 Cloudflare resources。
5. 执行 `vp run setup`。
6. 执行 `vp run verify:kit`。
7. 从 `templates/feature` 添加第一个 app-owned feature。
8. 只有当第一个 feature 需要时，再添加 app-owned migrations 与 routes。

## 4. Cloudflare Bindings

最低 binding：

```text
D1 database
R2 bucket
Queue
Email Sending
Email Routing, if inbound email is enabled
AI binding, if advisory features are enabled
```

默认本地 Worker 的 AI advisory 是 deterministic，不需要真实 AI binding 就能跑通第一个本地纵切。

## 5. App-Managed Auth

默认应用自己拥有用户系统：

1. Admin 创建邀请。
2. 系统发送邀请邮件。
3. 被邀请人点击链接。
4. 设置密码。
5. 用邮箱和密码登录。
6. 可通过邮件重置密码。

产品用户登录不依赖 Cloudflare Access。

## 6. 验收清单

可称为 usable 前，应满足：

1. `README.md` 说明如何运行。
2. 本地开发有一个主命令。
3. migration 可以本地和远程执行。
4. secrets 有文档但没有被提交。
5. 第一个 protected route 可用。
6. 敏感操作写 audit events。
7. 业务 feature code 没有泄漏到 reusable `packages/*`。
8. `templates/app/manifest.json` 的路径已复制或明确排除。
