# carboti

Raw-first data ingestion for emails, documents, and AI agents.

`carboti` is a Cloudflare-first ingestion runtime for teams that need to receive
emails, attachments, documents, and API payloads without losing provenance. It
stores raw inputs first, turns them into normalized envelopes and artifacts, and
keeps lineage and audit evidence available for downstream systems and agents.

中文版本：[README.zh-CN.md](./README.zh-CN.md)

## Positioning

`carboti` is not a mail parser, a workflow builder, or a business application.
It is a trustworthy data intake layer:

1. Simpler to operate than Apache NiFi for this narrow intake problem.
2. More provenance-aware than n8n-style workflow glue.
3. More neutral and embeddable than hosted parsing SaaS tools.

Business systems own business rules, final records, and downstream actions.
`carboti` owns source intake, raw preservation, artifacts, processor contracts,
lineage, replay, delivery, and auditability.

## Current Baseline

This repository is adopted from `qitu`, a business-neutral Cloudflare-first
application seed. The inherited baseline already provides:

1. React workbench shell.
2. Cloudflare Worker API.
3. App-managed auth and RBAC.
4. D1, R2, Queue, and Email bindings.
5. Source file intake and inbound email intake.
6. Import jobs, human review, audit events, and AI advisory records.
7. Verified local validation, integration, and browser smoke command paths.

`carboti` adds product-specific contracts for sources, connector manifests,
sinks, pipelines, artifacts, lineage, processors, webhooks, and API clients.

## Core Concepts

```text
Source       Where data enters from: Email Routing, HTTP upload, IMAP, Gmail, Graph, webhooks.
Raw Object   Original bytes: .eml, attachments, documents, JSON, HTML.
Message      A normalized envelope around raw email or document context.
Artifact     Derived output: text, HTML, JSON, table, record, or agent context bundle.
Processor    Built-in, external webhook, hosted, or agent-backed handler.
Pipeline     Source + processor + sink configuration.
Lineage      Raw -> attachment -> normalized message -> artifact -> export.
Sink         API pull, webhook, R2/S3, download, or queue delivery.
Replay       Re-run processing from preserved raw objects.
```

## Architecture

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

Cloudflare is the reference runtime:

1. Workers for API, ingest, webhook, MCP, and signed URLs.
2. Email Routing for default inbound email.
3. R2 for raw `.eml`, attachments, and derived files.
4. D1 for metadata, jobs, artifacts, lineage, and audit.
5. Queues for asynchronous processing and DLQ-backed recovery.
6. Workflows and Containers as declared runtime targets for long-running OCR, document parsing, and hosted processors.

## Development

```sh
vp run setup
vp run dev
vp run validate
```

Useful commands:

```sh
vp run smoke
vp run --filter @carboti/worker typecheck
vp run --filter @carboti/core typecheck
vp run db:migrate:local
```

The Worker exposes a first product contract endpoint:

```text
GET /api/carboti/contract
GET /api/carboti/openapi.json
```

Developer-facing packages now include:

```text
@carboti/sdk  Fetch-compatible TypeScript client.
@carboti/cli  Command surface for init, ingest, inspect, replay, and artifact export.
```

Connector and runtime surfaces:

```text
GET  /api/carboti/connectors/manifests
POST /api/carboti/connectors/sources
POST /api/carboti/connectors/sources/:sourceId/health
POST /api/carboti/connectors/sources/:sourceId/ingest
POST /api/carboti/connectors/sinks
GET  /api/carboti/processor-runtimes
POST /api/carboti/processors/hosted
```

Agent-facing surfaces:

```text
POST /api/carboti/mcp
POST /api/carboti/agent/artifacts/search
POST /api/carboti/agent/messages/:messageId/context
```

## Roadmap

1. `carboti` identity and qitu adoption baseline.
2. Core contracts for source, message, artifact, lineage, processor, and webhook delivery.
3. D1 schema for product metadata.
4. Inbound email to normalized message and artifact creation.
5. External processor webhook with HMAC signing, retry, and delivery logs.
6. OpenAPI and `@carboti/sdk`.
7. MCP server and agent-safe tools.
8. Connector manifests, source/sink registration, health checks, and generic connector ingest for Gmail, Microsoft Graph, IMAP, SES/Postmark/Mailgun, and S3/R2 expansion.
9. Hosted processor registration with capability manifests and resource limits.

## Repository Status

The project is early. The current codebase is a working Cloudflare-first
foundation plus the initial `carboti` product contracts. The full product plan
is tracked in [`docs/carboti/product-plan.md`](./docs/carboti/product-plan.md).
