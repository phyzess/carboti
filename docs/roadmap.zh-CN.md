# Roadmap

`qitu` 应通过真实 vertical slices 演进，而不是通过猜测式泛化扩张。

## Phase 0: Architecture Seed

状态：

```text
baseline complete
```

目标：

1. 建立项目身份。
2. 定义 package boundaries。
3. 定义 agent entrypoints。
4. 定义第一条 vertical slice。
5. 保持 core business-neutral。

退出标准：

1. `README.md` 清晰解释项目。
2. 架构文档描述 reusable core。
3. Agent docs 告诉 Codex、Claude Code 和 planning agents 如何工作。
4. 理解 core 不需要任何业务特定词汇。

## Phase 1: Skeleton App

状态：

```text
done
```

目标：

1. 创建 workspace structure。
2. 增加 React app shell。
3. 增加 Worker API shell。
4. 增加 shared config package。
5. 增加 DB migrations。
6. 增加 typecheck、tests、migrations 的本地命令。

当前状态：

1. App shell 可渲染，本地 reviewer setup/login UI 已接 Worker API。
2. 部署准备包含 local、preview、production binding stubs、same-origin Worker Static Assets 和 Queue DLQ config。

## Phase 2: First Vertical Slice

状态：

```text
baseline complete
```

目标：

1. Invite user。
2. 从 invite 注册。
3. 邮箱密码登录。
4. 上传 source file。
5. 存入 R2。
6. 创建 import job。
7. 异步处理 job。
8. 写 staging records。
9. Review 并 approve records。
10. Commit business-owned records。
11. 写 audit events。

已完成 P0 baseline：

1. Auth bootstrap。
2. Source file intake。
3. Import job state machine。
4. Review staging and approval。
5. Commit with audit。
6. Password reset and email delivery baseline。
7. Emailed invite 和 password-reset landing pages。
8. app-owned starter feature 的 adapter-driven parse/stage/validate/commit。
9. Failure visibility、failure classification、manual retry controls。
10. Browser coverage 覆盖 approved/commit 与 rejected review decisions。
11. 第二个 JSON records feature adapter，用来证明 registry path。
12. AI advisory artifacts、本地 deterministic generation、human confirm/dismiss、web panel、audit。
13. Minimal RBAC：邀请分配角色、写路由守卫、read-only viewer、audited denials。
14. Adapter validation edge-case：非法数字留在 review，并阻止 commit。
15. DLQ 与 failed-job remediation runbook，以及只读 D1 failed-job snapshot command。

剩余 P1 follow-up：

```text
None
```

未来 production hardening 可以在真实队列运行证明需要后，增加自动 DLQ consumer。

当前验证：

1. `vp run smoke` 覆盖从 invite 到 audit visibility 的 Worker handler path，使用 local D1/Email/R2/Queue fakes。
2. React console 调用 Worker API client 完成 setup/login/password reset、upload、source files、jobs、local queue drain、review decisions、AI advisory、commit、manual retry、audit。
3. `vp run test:worker-runtime` 使用官方 Cloudflare Vitest pool 验证 Workers runtime 中的 `/health` 和未登录上传拒绝。
4. `vp run smoke:browser` 启动本地 Web/Worker dev，并在 Chromium 中跑 invite、reset、login、upload、queue drain、approve、commit、reject、audit。
5. `vp run ops:failed-jobs` 提供 failed、queued、processing import jobs 的只读 operator snapshot。

## Phase 3: Second Feature Test

状态：

```text
baseline complete
```

目标：

1. `examples/json-records` 增加第二个 concrete feature。
2. 复用 auth、file、job、review、audit、email packages。
3. Worker registry 通过 `.json` filename 或 `application/json` content type 选择它。

退出标准：

1. 第二个 feature 不增加 core 概念。
2. Core package contracts 不变。
3. Smoke 和 package interface tests 独立验证 optional examples；Worker integration 继续覆盖 app-owned starter adapters。

## Phase 4: Extraction Quality

状态：

```text
baseline complete; future extraction hardening tracked
```

目标：

1. 稳定 package APIs。
2. 维护 new apps 与 new feature slices 的 templates。
3. 增加 generated apps smoke tests。
4. 增加 release notes 和 upgrade notes。

当前验证：

1. `templates/app/manifest.json` 由 smoke 检查 missing copy paths。
2. `templates/feature` 是 workspace package，带 typechecked `ImportFeatureAdapter` 和 app-owned registry starter。
3. Release/upgrade notes 描述当前 starter baseline 和安全采用路径。

## Phase 5: Product-Grade Starter Hardening

状态：

```text
baseline complete
```

目标：

把可运行 baseline 打磨成一个 startup kit：其他团队或 agent clone 后，可以运行、理解、扩展，并且不会马上遇到明显的页面定位或流程联动矛盾。

边界：

这轮 hardening 必须保持 business-neutral。改动应位于 app-owned shell、Worker routes、可复用 qitu UI primitives、文档或验证脚本中；不能把 business metrics、business parser fields、business workflows 或 business reports 加进 `packages/*`。

已完成要求：

1. 页面指标和标签必须说明真实数据范围。
2. 跨页面动作必须保留 workflow context，尤其是 Imports 与 Reviews 之间的 selected import job。
3. React shell 必须清楚呈现 RBAC：viewer 在遇到后端 `403` 前就应看到 read-only affordance。
4. 每个 route 应显示有用的 empty、error、blocked states，而不是依赖隐藏的顶层 error。
5. Review 页面应区分 selected-job review state 与 workspace-wide state。
6. Audit settings 页面应通过 filtering、details、清楚的 actor/subject context 变成可用 visibility tool。
7. Member/invitation settings 应覆盖 internal app starter 预期的 invitation lifecycle。
8. Browser smoke 或 integration checks 应覆盖用户能从 UI 打断的 workflow invariants。

第一轮 hardening increment：

1. 让第一版 role-aware UI controls 与现有 RBAC permissions 一致。
2. 从 Imports 打开 Reviews 时保留 selected job context。
3. 重命名并重新计算 overview/review labels，避免暗示 UI 实际没有的数据范围。
4. 在 authenticated workbench 内显示 non-review route errors。

第二轮 hardening increment：

1. 让 audit route 成为有用的 settings visibility page，而不只是 passive timeline。
2. 增加 action、actor、subject kind、subject id 的 server-backed audit filters。
3. 显示选中 audit event 的 actor、subject、timestamp 和 metadata。
4. 在 Worker integration 和 browser smoke 中覆盖 audit filtering。

第三轮 hardening increment：

1. 增加 authenticated invitation revocation route，并复用现有 invitation-management permission。
2. 撤销 pending invitations 时写 `invitation.revoked` audit event。
3. 在 Users route 显示 invitation lifecycle timestamps 和 revoke actions。
4. 通过 Worker integration 和 browser smoke 覆盖 invitation revocation。

第四轮 hardening increment：

1. 在 Sources route 显示 source-file-to-import-job linkage。
2. 把 Imports inspector 变成 job diagnostics panel，展示 status、adapter、attempts、failure class/reason、timestamps 和 content hash。
3. 复用 `import_job_events` 作为 Imports route event stream，使 failures 和 retries 在打开 Reviews 前可见。
4. 在 browser smoke 中覆盖 diagnostics panel。

第五轮 hardening increment：

1. 为 failed、queued、processing、review-ready import jobs 显示 page-local recovery path。
2. 把 failure classes 映射到 DLQ runbook 中的 neutral remediation guidance。
3. 把 retry action 放进 selected job diagnostics panel，并保留 RBAC-disabled states。
4. 在 browser smoke 中覆盖真实 failed JSON import 和 recovery guidance。

第六轮 hardening increment：

1. 把 AI advisory panel 纳入 first vertical slice 的 browser smoke。
2. 从 Review route 生成 local deterministic advisory。
3. 通过 UI confirm advisory，再 approve 和 commit record。
4. 断言 import job event stream 显示 `ai_advisory.confirmed`。

第七轮 hardening increment：

1. 主导航只保留 Workspace 和 Settings。
2. Source upload、import diagnostics 与 review workflows 收到 `/workspace` 下。
3. Account、members/invitations 与 audit visibility 收到 `/settings` 下。
4. 不保留 pre-release flat route paths 的兼容 redirect。
5. Import job status 从 staged-record counts 推导，partial commit 后仍有 pending rows 时保持 review 语义。

## Completion Gate

最终目标由 `docs/kit-completion.zh-CN.md` 定义。

项目只有在以下条件满足时才算完成：

1. Roadmap 中所有 P0 已实现。
2. `docs/capability-matrix.md` 与实际实现一致。
3. `vp run verify:kit` 通过。
4. 本地 clean D1 migration 可应用。
5. 第一条 vertical slice 不需要手工数据库编辑即可完成。
