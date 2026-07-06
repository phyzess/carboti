# Carboti Product Plan

Status: draft
Date: 2026-07-06

## 1. Objective

Carboti is a raw-first data ingestion layer for emails, documents, third-party
systems, and AI agents.

It should let a team receive data from email forwarding, Cloudflare Email
Routing, HTTP upload, webhooks, and future mailbox connectors; preserve raw
inputs; extract normalized envelopes and artifacts; and deliver structured
outputs to other systems with lineage and audit evidence.

## 2. Product Boundary

Carboti owns:

1. Source intake.
2. Raw object preservation.
3. Source, message, attachment, artifact, and lineage metadata.
4. Processor run records.
5. External processor contracts.
6. Replay from raw data.
7. Webhook/API/download output.
8. Agent-safe tool surfaces.
9. Audit and delivery evidence.

Carboti does not own:

1. Business-specific fields.
2. Business calculations.
3. Final business truth.
4. Business dashboards.
5. Business-specific parser DSLs.
6. Automatic AI commits without review.

## 3. Reference Runtime

The reference deployment target is Cloudflare:

```text
Email Routing / HTTP ingest / connector
-> Worker ingest route
-> R2 raw store
-> D1 metadata
-> Queue
-> processor route / Workflow / external processor
-> artifact and lineage records
-> API / webhook / MCP / signed download
```

The implementation starts from qitu because qitu already provides the
Cloudflare-first app shell, auth, RBAC, R2 file intake, D1 metadata, Queue jobs,
inbound email, human review, audit events, and AI advisory boundaries.

## 4. Core Contract

The first reusable product package is `@carboti/core`.

It owns business-neutral contracts:

1. Source kinds.
2. Object kinds.
3. Artifact kinds.
4. Processor kinds.
5. Sink kinds.
6. Message envelopes.
7. Artifacts.
8. Lineage edges.
9. Processor runs.
10. Webhook deliveries.

The package deliberately contains schemas and pure helpers only. Runtime
binding details stay in `apps/worker`.

## 5. Data Model Additions

Carboti adds product metadata tables beside the inherited qitu tables:

```text
carboti_sources
carboti_pipelines
carboti_processor_configs
carboti_processor_runs
carboti_objects
carboti_artifacts
carboti_lineage_edges
carboti_webhook_endpoints
carboti_webhook_deliveries
carboti_api_clients
```

Raw bytes still live in R2. D1 stores metadata, lineage, delivery status, and
small JSON payloads only.

## 6. Third-Party Integration

Third-party systems can integrate in four layers:

1. Direct ingest through API upload.
2. Webhook delivery after processing.
3. External processor webhook for custom extraction logic.
4. SDK embedding in their own Worker or Node service.

The first custom logic path should be an external processor webhook:

```text
normalized message -> signed processor request -> artifacts -> lineage -> sink
```

Hosted plugins and marketplace-style distribution come later.

## 7. Agent Readiness

Carboti should be agent-ready, not agent-first.

The agent surface should expose curated tools:

```text
search_messages
get_message_context
list_attachments
get_signed_download_url
create_extraction_job
submit_artifact
replay_job
get_pipeline_status
```

Rules:

1. Email body and attachments are untrusted content.
2. Agent tools use scoped authorization.
3. Raw and attachment access uses short-lived signed URLs.
4. Artifact writes require schema validation.
5. External actions require policy gates and audit events.

## 8. MVP

The first product slice is:

1. Receive email through Cloudflare Email Routing.
2. Store raw `.eml` in R2.
3. Store inbound message and attachment metadata in D1.
4. Store supported attachments in R2.
5. Create normalized message/artifact records.
6. Track raw-to-artifact lineage.
7. Expose artifact and lineage API.
8. Deliver processing results through webhook.
9. Support replay from raw data.
10. Show raw, attachments, job timeline, artifact, lineage, and audit in the UI.

## 9. Phases

### Phase 0: Adopt qitu

1. Create public GitHub repository.
2. Import qitu baseline.
3. Apply `carboti` identity.
4. Verify baseline.

### Phase 1: Intake Contracts

1. Add `@carboti/core`.
2. Add product metadata tables.
3. Add contract endpoint.
4. Add product plan documentation.

### Phase 2: Public Ingest and Evidence APIs

1. Write normalized message artifacts from inbound email.
2. Persist lineage edges.
3. Add raw-first HTTP ingest for provisioned API clients.
4. Add object, artifact, and lineage read routes.
5. Add replay records from preserved raw objects.

### Phase 3: External Processors

1. Add processor config API.
2. Sign requests with HMAC.
3. Record processor runs.
4. Validate returned artifacts.
5. Retry and log delivery failures.

### Phase 4: Developer Surface

1. Publish OpenAPI description.
2. Add `@carboti/sdk`.
3. Add CLI commands: `ingest`, `inspect`, `replay`.

### Phase 5: Agent Surface

1. Add MCP server.
2. Add agent context bundle artifacts.
3. Add policy gate and audit around agent actions.

### Phase 6: Connectors and Hosted Processors

1. Gmail.
2. Microsoft Graph.
3. IMAP.
4. SES/Postmark/Mailgun inbound webhooks.
5. Hosted processor runtime.
6. Capability manifest and sandboxing.
