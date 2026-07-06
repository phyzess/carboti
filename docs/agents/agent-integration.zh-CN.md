# Agent 接入

Status: draft
Date: 2026-06-27

## 1. 目的

`qitu` 应该容易被 coding agent 和 planning agent 理解。本仓库提供明确入口：

1. Codex 与其他兼容 `AGENTS.md` 的 coding agents。
2. Claude Code。
3. Pi 风格的 planning/conversational agents。

## 2. 根入口

| File        | 目标 agent            | 目的                                 |
| ----------- | --------------------- | ------------------------------------ |
| `AGENTS.md` | Codex / coding agents | 操作指令、shell preference、边界规则 |
| `CLAUDE.md` | Claude Code           | Claude Code 专用工作规则             |
| `PI.md`     | Pi / planning agents  | 产品与架构讨论指南                   |

## 3. 推荐阅读顺序

任何 agent 都先读：

1. `README.md` 或 `README.zh-CN.md`。
2. `docs/kit-completion.md` 或 `docs/kit-completion.zh-CN.md`。
3. `docs/capability-matrix.md` 或 `docs/capability-matrix.zh-CN.md`。
4. `docs/architecture/overview.md` 或 `docs/architecture/overview.zh-CN.md`。
5. `docs/architecture/package-boundaries.md` 或 `docs/architecture/package-boundaries.zh-CN.md`。
6. `docs/decisions/decision-log.md` 或 `docs/decisions/decision-log.zh-CN.md`。
7. 与任务相关的 architecture/guides 文档。

## 4. 任务路由

### 4.1 Core Architecture

阅读：

1. `docs/architecture/overview.zh-CN.md`
2. `docs/architecture/package-boundaries.zh-CN.md`
3. `docs/architecture/data-model.zh-CN.md`

输出：

1. 架构文档更新。
2. decision log entry。
3. boundary notes。

### 4.2 Import Pipeline

阅读：

1. `docs/architecture/import-pipeline.zh-CN.md`
2. `docs/architecture/data-model.zh-CN.md`
3. `docs/architecture/auth-security.zh-CN.md`
4. `docs/guides/add-feature.zh-CN.md`

输出：

1. 通用 workflow 更新。
2. adapter contract 更新。
3. 幂等与 review transition 测试。

### 4.3 Auth/Security

阅读：

1. `docs/architecture/auth-security.zh-CN.md`
2. `docs/architecture/data-model.zh-CN.md`

输出：

1. token/session-safe implementation。
2. security event handling。
3. redaction checks。

### 4.4 Business Feature

阅读：

1. `docs/guides/add-feature.zh-CN.md`
2. `docs/architecture/package-boundaries.zh-CN.md`
3. app-specific docs, if present。

输出：

1. feature adapter。
2. feature staging schema。
3. feature UI pages。
4. 不把业务概念泄漏进 core packages。

### 4.5 UI Component

阅读：

1. `docs/architecture/ui-design-system.zh-CN.md`
2. `docs/architecture/package-boundaries.zh-CN.md`
3. `docs/decisions/decision-log.zh-CN.md`

输出：

1. bespoke implementation 前先做 shadcn/Base UI registry discovery。
2. 新增或修改的 primitive 封装在 `packages/ui`，并从 `@carboti/ui` 导出。
3. App 页面消费 `@carboti/ui`，不直接 import Base UI，也不写页面级 shadcn lookalike。
4. 当 primitive 成为必须使用的 paved path 时，补 smoke 或 package-interface coverage。

## 5. Agent 安全规则

1. 不打印 secrets。
2. 不凭空编造 Cloudflare limits，需要查文档。
3. 不静默改变 architecture decisions。
4. 不把业务代码加入 core packages。
5. 不实现绕过人工 review 的 AI 路径。
6. 不在没有 decision record 的情况下加入新框架。
7. 没有先检查 shadcn/Base UI registry 与现有 qitu primitives 时，不在 app 页面手写 shadcn-style controls。

## 6. Handoff 格式

交接时包含：

```text
Objective
Files changed
Current decisions
Open questions
Verification performed
Next recommended step
```
