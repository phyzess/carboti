# 故障排查

Status: draft
Date: 2026-06-27

## 1. `vp install` 无法访问 `registry.npmjs.org`

典型错误：

```text
error sending request for url (https://registry.npmjs.org/pnpm/-/pnpm-11.5.2.tgz)
tcp connect error: Connection refused
```

含义：

项目本身 registry-neutral，但当前机器或网络无法访问 public npm registry。

先执行：

```sh
vp run doctor
```

检查：

1. 公司代理或 VPN。
2. user-level npm registry config。
3. `NPM_CONFIG_REGISTRY` 环境变量。
4. 防火墙是否阻断 `registry.npmjs.org`。

不要把公司内部 registry 提交到这个 reusable starter 的 `.npmrc`。公司内部需要时，放在 user-level config 或下游私有 fork。

## 2. TypeScript 7 RC 平台包下载失败

`typescript@7.0.1-rc` 可能解析到平台包，例如：

```text
@typescript/typescript-darwin-arm64@7.0.1-rc
```

如果失败，通常是 registry 可达性或 mirror freshness 问题，不是项目 manifest 问题。

建议：

1. 保持 `typescript` pinned 到 `7.0.1-rc`。
2. 确认 registry 能提供对应平台包。
3. 不要无记录地替换成 `typescript@6`。

## 3. `pnpm peers check` 内部错误

`pnpm@11.5.2` 可能出现：

```text
Cannot read properties of undefined (reading 'devDependencies')
```

这不是有效 peer dependency report。当前 workaround：

1. 保持 `pnpm-lock.yaml` 来自 `pnpm install --lockfile-only --ignore-scripts`。
2. 用 `vp run smoke` 做 template invariant checks。
3. dependencies 安装后用 `vp run validate`。
4. 以后升级 pnpm 时通过显式 dependency decision 重新评估。

## 4. Wrangler Type Generation 失败

执行：

```sh
vp run cf:typegen
```

失败时检查：

1. dependencies 是否已安装。
2. `apps/worker/wrangler.jsonc` 是否是有效 JSONC。
3. `wrangler@4.103.0` 是否可用。
4. 只有准备立即重生成时，才删除旧的 `apps/worker/worker-configuration.d.ts`。

## 5. Local D1 Migration 失败

执行：

```sh
vp run db:migrate:local
```

失败时检查：

1. `apps/worker/migrations` 是否存在。
2. `apps/worker/wrangler.jsonc` 中 local D1 database name 是否为 `carboti-dev`。
3. Wrangler 是否能在 `.wrangler/` 下创建 local state。

## 6. Import Job 一直 queued

预期状态：

```text
queued -> processing -> needs_review
queued -> processing -> failed
```

若一直 queued：

1. 确认 Queue consumer 通过 `vp run dev` 或 `vp run dev:worker` 运行。
2. 确认 `IMPORT_JOBS` 在 `apps/worker/wrangler.jsonc` 中绑定。
3. 查询 local jobs：

```sh
npx wrangler d1 execute carboti-dev --local --config apps/worker/wrangler.jsonc --command "SELECT id,status,failure_reason FROM import_jobs ORDER BY created_at DESC LIMIT 5"
```

## 7. Upload 后 Queue Dispatch 失败

如果 source metadata 已写入但 Queue dispatch 失败，Worker 会把 import job 标记为 `failed` 并保存 failure reason。

查询：

```sh
npx wrangler d1 execute carboti-dev --local --config apps/worker/wrangler.jsonc --command "SELECT id,status,failure_reason FROM import_jobs WHERE status = 'failed' ORDER BY updated_at DESC LIMIT 5"
```

修复底层原因后，通过 UI 或 API retry：

```sh
curl -X POST http://127.0.0.1:8787/api/import-jobs/<job-id>/retry
```

retry route 需要 authenticated session。它会重置 job 为 `queued`、清除失败字段、发送新 Queue message，并写 `import_job.retry_queued` audit event。

## 8. `dev` 启动一个进程后退出

`vp run dev` 同时启动 web 和 Worker dev server。若一边非零退出，wrapper 会停止另一边。

分开运行定位：

```sh
vp run dev:web
vp run dev:worker
```

## 9. Generated Files 看起来过期

`apps/web/dist` 是 build output，不是 source truth。修改 `apps/web/src/*` 后重新 build。

## 10. AI Output 出现在 committed data

这违反默认策略。

规则：

1. AI 可以建议、分类、提取、解释。
2. AI output 必须作为 advisory records 保存。
3. 人工 reviewer 必须确认后，业务记录才能 commit。
4. audit event 必须能串起 reviewer、source file、advisory record 与 commit。
