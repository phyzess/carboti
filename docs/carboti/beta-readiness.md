# Carboti Beta Readiness

This checklist defines what must be true before an internal project integrates
with Carboti.

## 1. Configuration and Credentials

Carboti now exposes token-scoped administration APIs:

```text
GET  /api/carboti/api-clients
POST /api/carboti/api-clients
POST /api/carboti/api-clients/:clientId/revoke
GET  /api/carboti/secrets
POST /api/carboti/secrets
POST /api/carboti/secrets/:secretRef/revoke
```

API client tokens are returned once. The database stores only `token_hash`.
Secret refs expose metadata only; plaintext and ciphertext are never returned
through the API.

Connector config must remain non-secret. Credentials are passed as `secretRefs`
when registering connector sources or sinks.

## 2. Integration Loop

Internal projects can integrate through three stable paths:

1. Direct HTTP ingest: `POST /api/carboti/ingest/http`.
2. Connector ingest: `POST /api/carboti/connectors/sources/:sourceId/ingest`.
3. Processor artifact submit: `POST /api/carboti/messages/:messageId/artifacts`.

The TypeScript SDK wraps these paths, plus API clients, secret refs, connector
registration, trace, replay, and artifact download helpers.

## 3. Observability and Troubleshooting

Use message trace as the primary support view:

```text
GET /api/carboti/messages/:messageId/trace
```

The trace returns objects, artifacts, lineage edges, processor runs, webhook
deliveries, and related audit events. Operators can still use the existing DLQ
and failed-job runbooks for import-job failures.

## 4. Data Output

Artifacts can be consumed in three ways:

```text
GET  /api/carboti/artifacts/:artifactId
GET  /api/carboti/artifacts/:artifactId/download
POST /api/carboti/artifacts/:artifactId/download-url
```

Signed download URLs are short-lived and do not require bearer auth. They are
intended for handoff to downstream systems that need a bounded download link.

## 5. Security Boundary

Scopes are explicit. Recommended internal-project scopes:

```text
ingest:write
artifacts:read
artifacts:write
lineage:read
messages:read
processors:invoke
replay:write
```

Administration should stay separate:

```text
api_clients:read
api_clients:write
secrets:read
secrets:write
connectors:read
connectors:write
```

Agent access uses `agent:read` and remains separate from raw object access.
Raw objects are preserved in R2 and are not exposed through the agent-safe
surface.

Retention and deletion are intentionally policy-first for the beta. Before
production use, choose workspace-level retention for raw objects, artifacts, and
audit records, then add automated cleanup.

## 6. Deployment Baseline

Before connecting an internal project:

```sh
vp run validate
vp run test:worker-runtime
vp run db:migrate:local
vp run smoke:browser
```

For remote environments, use the existing deployment runbooks:

```text
docs/deployment.md
docs/operations/dlq-remediation.md
docs/troubleshooting.md
```

Preview and production must have D1, R2, Queue, Email, and
`CARBOTI_SECRET_ENCRYPTION_KEY` configured before secrets or signed downloads
are used.
