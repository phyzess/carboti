# 首个纵切

Status: draft
Date: 2026-06-27

第一个实现应以最小有用业务功能证明完整系统路径。

## 1. Slice

```text
invite -> register -> login -> upload -> import job -> queue -> staging -> review -> advisory -> approve -> commit -> audit
```

## 2. 为什么是这个 slice

它会同时压到真正重要的 reusable 部分：

1. Auth。
2. Email。
3. File storage。
4. Async jobs。
5. Parser adapter。
6. Staging。
7. Human review。
8. AI advisory boundary。
9. Commit handler。
10. Audit trail。

它也会尽早暴露 performance 与 Worker runtime 限制。

## 3. 最小页面

1. Login。
2. Invite acceptance。
3. Source file list。
4. Upload dialog。
5. Import job detail。
6. Staging review table。
7. Audit event drawer/timeline。

## 4. 最小 API

1. Create invite。
2. Accept invite。
3. Login。
4. Logout。
5. Request password reset。
6. Upload file。
7. List source files。
8. Create import job。
9. List import jobs。
10. Get import job review detail。
11. List staging records。
12. Approve/reject staged records。
13. List/generate/confirm/dismiss AI advisories。
14. Commit confirmed records。
15. List audit events。

## 5. 最小 Worker Jobs

1. Parse source file。
2. Validate parsed records。
3. Create staging records。
4. Mark job completed or failed。

## 6. Done Means

1. 用户不需要手动改数据库即可跑完整流程。
2. failed jobs 保留足够 debug 信息。
3. 第二个 parser 可加入而不重写 pipeline。
4. 每个 commit 都有 reviewer 与 audit trail。
5. 没有 AI advisory 会绕过人工确认被提交。

## 7. 实施顺序

按 tracer-bullet 做，不按水平层拆。

1. Auth bootstrap：邀请、邮件 token、accept page、密码设置、login/logout、session cookie。
2. Source file intake：upload UI、Worker upload route、R2 object、D1 metadata、audit event。
3. Import job：create job、Queue message、consumer、状态流、失败原因。
4. Feature adapter：parser、staging payload、review issues、`commitApproved`。
5. Review and commit：staging table、approve/reject、reviewer note、commit、audit。

## 8. 当前状态摘要

已具备：

1. 邀请、登录、密码重置、email metadata、audit 的集成测试。
2. 上传 UI、R2/D1 metadata、queue dispatch、idempotency、audit。
3. text/json 两个 app-owned starter adapters。
4. review approve/reject/commit/retry API 与 React review 页面。
5. local deterministic AI advisory。
6. browser smoke 覆盖本地 setup、upload、queue drain、AI advisory 生成与确认、review approval、commit、review rejection、failed JSON diagnostics、audit。

当前边界：

1. Source download 不属于 starter completion contract；如果具体 app 后续新增下载路由，必须在 app-owned route 中做权限校验并写审计。
2. 更多 adapter-specific failure classes 应随真实 feature adapter 增加，不在中立 starter 中预造。
3. `apps/worker/wrangler.jsonc` 已声明 Queue `max_retries` 和 DLQ 名称；生产前仍需在真实 Cloudflare 账号中 provision 对应资源。
