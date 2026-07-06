# qitu 中文文档入口

Status: draft
Date: 2026-06-27

这组中文文档面向国内团队、业务方和中文协作场景。英文原文仍保留为 canonical 工程文档；中文版本用于快速理解项目边界、采用方式和当前成熟度。

## 推荐阅读顺序

1. [README.zh-CN.md](../README.zh-CN.md)：项目定位、命名、目录和核心原则。
2. [kit-completion.zh-CN.md](./kit-completion.zh-CN.md)：什么叫“完成但不膨胀”。
3. [setup.zh-CN.md](./setup.zh-CN.md)：本地启动、验证和常用命令。
4. [capability-matrix.zh-CN.md](./capability-matrix.zh-CN.md)：能力成熟度与 production-ready 判断。
5. [architecture/overview.zh-CN.md](./architecture/overview.zh-CN.md)：整体架构。
6. [architecture/package-boundaries.zh-CN.md](./architecture/package-boundaries.zh-CN.md)：core package 与业务代码边界。
7. [architecture/data-model.zh-CN.md](./architecture/data-model.zh-CN.md)：core-owned 通用数据模型。
8. [architecture/auth-security.zh-CN.md](./architecture/auth-security.zh-CN.md)：鉴权、邀请、session、RBAC 与审计。
9. [architecture/import-pipeline.zh-CN.md](./architecture/import-pipeline.zh-CN.md)：导入、staging、review、commit 的核心流程。
10. [architecture/ai-advisory.zh-CN.md](./architecture/ai-advisory.zh-CN.md)：AI 只做 advisory 的边界。
11. [architecture/ui-design-system.zh-CN.md](./architecture/ui-design-system.zh-CN.md)：UI、设计系统、字体与图表边界。
12. [architecture/ui-component-provenance.zh-CN.md](./architecture/ui-component-provenance.zh-CN.md)：UI primitive 来源与合规台账。
13. [architecture/dependencies.zh-CN.md](./architecture/dependencies.zh-CN.md)：依赖包与精确版本基线。
14. [guides/create-app.zh-CN.md](./guides/create-app.zh-CN.md)：从 qitu 创建新应用。
15. [guides/add-feature.zh-CN.md](./guides/add-feature.zh-CN.md)：添加业务 feature 的边界与方式。
16. [guides/first-vertical-slice.zh-CN.md](./guides/first-vertical-slice.zh-CN.md)：首个端到端纵切。
17. [deployment.zh-CN.md](./deployment.zh-CN.md)：Cloudflare 部署准备。
18. [demo.zh-CN.md](./demo.zh-CN.md)：前端静态 demo 与 Cloudflare Pages 展示环境。
19. [troubleshooting.zh-CN.md](./troubleshooting.zh-CN.md)：安装、Wrangler、D1、Queue、AI 边界故障排查。
20. [operations/dlq-remediation.zh-CN.md](./operations/dlq-remediation.zh-CN.md)：DLQ 与失败任务恢复。
21. [agents/agent-integration.zh-CN.md](./agents/agent-integration.zh-CN.md)：Codex、Claude Code、Pi 等 agent 接入方式。
22. [roadmap.zh-CN.md](./roadmap.zh-CN.md)：路线图与当前完成状态。
23. [decisions/decision-log.zh-CN.md](./decisions/decision-log.zh-CN.md)：已接受决策。
24. [decisions/refactor-locality-2026-07.zh-CN.md](./decisions/refactor-locality-2026-07.zh-CN.md)：2026 年 7 月架构拆分详细决策。

## 维护规则

1. 中文文档与英文文档并列，不覆盖英文原文。
2. 命令、package name、binding name、table name、API path 不翻译。
3. 中文版本可以做少量整理，但不能改变工程事实。
4. 如果英文文档发生影响采用方式的变化，应同步更新对应中文文档。
5. 不要求所有低层模板文档都翻译；优先翻译会影响采用、架构判断和运维恢复的关键文档。
