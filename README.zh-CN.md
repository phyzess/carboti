# carboti

面向邮件、文档和 AI agent 的 raw-first 数据接入运行时。

`carboti` 是一个 Cloudflare-first 的数据接入层。它帮助团队接收邮件、附件、文档、Webhook 和 API payload，先保存原始数据，再提取标准化 envelope、artifact、lineage 和可审计的处理记录，最后把结果交给业务系统、第三方应用或 agent 使用。

English version: [README.md](./README.md)

## 定位

`carboti` 不是邮件解析 SaaS、不是通用工作流编排器，也不是业务应用。它更像一个可信的数据入口：

1. 比 Apache NiFi 更轻，专注在外部数据接入与留痕。
2. 比 n8n 式自动化更强调 raw preservation、lineage、replay 和治理。
3. 比 Parseur 等托管解析产品更中立，可自托管，也更适合作为开发者基础设施。

业务系统仍然拥有业务规则、最终数据模型、业务动作和权限解释。`carboti` 拥有来源接入、原始保存、标准化产物、处理器契约、血缘、重放、交付和审计。

## 当前基线

本仓库从 `qitu` starter kit 迁移而来。继承的 Cloudflare-first 基线已经提供：

1. React workbench shell。
2. Cloudflare Worker API。
3. App-managed auth 与 RBAC。
4. D1、R2、Queue、Email bindings。
5. 源文件接入与 inbound email 接入。
6. Import jobs、人工 review、audit events 和 AI advisory records。
7. 本地 validate、integration 和 browser smoke 的命令路径。

`carboti` 在此基础上新增产品契约：source、pipeline、artifact、lineage、processor、webhook endpoint、webhook delivery、connector manifest、sink 和 API client。

## 核心概念

```text
Source       数据从哪里进入：Cloudflare Email Routing、HTTP upload、IMAP、Gmail、Graph、webhook。
Raw Object   原始字节：.eml、附件、文档、JSON、HTML。
Message      对邮件或文档上下文的标准化 envelope。
Artifact     派生产物：text、HTML、JSON、table、record、agent context bundle。
Processor    内置、外部 webhook、托管运行时或 agent-backed handler。
Pipeline     Source + processor + sink 的配置。
Lineage      Raw -> attachment -> normalized message -> artifact -> export。
Sink         API pull、webhook、R2/S3、download 或 queue delivery。
Replay       基于已保存 raw object 重新运行处理。
```

## 架构

```text
Email Routing / HTTP ingest / Upload / Connector
-> Ingest Worker
-> R2 raw store
-> D1 metadata
-> Queue
-> Processor Worker / Workflow / external processor
-> Artifacts + lineage
-> API / webhook / MCP / download
```

Cloudflare 是默认参考运行时：

1. Workers 承载 API、ingest、webhook、MCP 和 signed URL。
2. Email Routing 承载默认 inbound email。
3. R2 保存 `.eml`、附件和派生产物。
4. D1 保存 metadata、jobs、artifacts、lineage 和 audit。
5. Queues 承载异步处理与 DLQ 恢复。
6. Workflows 和 Containers 作为长任务 OCR、文档解析和托管 processor 的声明式 runtime target。

## 开发

```sh
vp run setup
vp run dev
vp run validate
```

常用命令：

```sh
vp run smoke
vp run --filter @carboti/worker typecheck
vp run --filter @carboti/core typecheck
vp run db:migrate:local
```

Worker 当前暴露的第一个产品契约端点：

```text
GET /api/carboti/contract
GET /api/carboti/openapi.json
```

面向开发者的 package：

```text
@carboti/sdk  Fetch-compatible TypeScript client.
@carboti/cli  init、ingest、inspect、replay、artifact export 命令表面。
```

面向 connector 和 runtime 的入口：

```text
GET  /api/carboti/connectors/manifests
POST /api/carboti/connectors/sources
POST /api/carboti/connectors/sources/:sourceId/health
POST /api/carboti/connectors/sources/:sourceId/ingest
POST /api/carboti/connectors/sinks
GET  /api/carboti/processor-runtimes
POST /api/carboti/processors/hosted
```

面向 agent 的入口：

```text
POST /api/carboti/mcp
POST /api/carboti/agent/artifacts/search
POST /api/carboti/agent/messages/:messageId/context
```

## 路线图

1. 完成 `carboti` identity 与 qitu adoption baseline。
2. 固化 source、message、artifact、lineage、processor、webhook delivery 等核心契约。
3. 建立 D1 产品 metadata schema。
4. 完成 inbound email 到 normalized message 与 artifact 的创建。
5. 增加外部 processor webhook，包含 HMAC signing、retry 和 delivery logs。
6. 提供 OpenAPI 与 `@carboti/sdk`。
7. 提供 MCP server 与 agent-safe tools。
8. 为 Gmail、Microsoft Graph、IMAP、SES/Postmark/Mailgun、S3/R2 扩展提供 connector manifests、source/sink registration、health checks 和 generic connector ingest。
9. 增加带 capability manifest 和资源限制的 hosted processor registration。

## 当前状态

项目仍处于早期。当前代码库已经具备可运行的 Cloudflare-first 基础设施，以及第一版 `carboti` 产品契约。完整方案见 [docs/carboti/product-plan.md](./docs/carboti/product-plan.md)。
