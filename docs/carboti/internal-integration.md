# Internal Project Integration Guide

This guide is the recommended path for the first internal Carboti integration.

## 1. Create a Project Token

Use an admin-scoped token to create a narrower project token:

```sh
carboti api-client create \
  --name "internal-project" \
  --scopes "ingest:write,artifacts:read,artifacts:write,lineage:read,messages:read,replay:write"
```

Store the returned token in the internal project's secret manager. It is only
returned once.

## 2. Register Connector Credentials

Create connector credentials as secret refs:

```sh
printf "%s" "$CONNECTOR_SECRET" | carboti secret create \
  --name "internal-project connector" \
  --kind connector_credential
```

Use the returned `secret.id` as a connector `secretRefs` value.

## 3. Register a Source

```ts
import { CarbotiClient } from "@carboti/sdk";

const carboti = new CarbotiClient({
  baseUrl: process.env.CARBOTI_BASE_URL!,
  token: process.env.CARBOTI_API_TOKEN!,
});

const source = await carboti.registerConnectorSource({
  kind: "r2",
  name: "internal-project incoming",
  config: {
    bucket: "incoming-documents",
    prefix: "raw/",
  },
  secretRefs: {
    credential: "secret:connector_credential:...",
  },
});
```

## 4. Ingest Raw Input

For direct push:

```ts
const ingest = await carboti.ingestConnectorObject(source.source.id, {
  connectorMessageId: "internal://message-123",
  contentText: "label,value\nExample,42\n",
  contentType: "text/csv",
  filename: "example.csv",
  metadata: {
    upstreamId: "message-123",
  },
});
```

For simple HTTP ingest:

```ts
await carboti.ingestHttp({
  body: new Blob(["hello"]),
  contentType: "text/plain",
  filename: "hello.txt",
});
```

## 5. Submit Custom Processor Output

```ts
await carboti.submitMessageArtifact(ingest.messageId, {
  kind: "processor_output",
  schemaId: "internal.project.output.v1",
  data: {
    rows: 1,
    total: 42,
  },
});
```

## 6. Inspect, Download, and Replay

```ts
const trace = await carboti.getMessageTrace(ingest.messageId);
const artifacts = await carboti.listMessageArtifacts(ingest.messageId);

const download = await carboti.createArtifactDownloadUrl(artifacts.artifacts[0].id, {
  ttlSeconds: 300,
});

await carboti.replayMessage(ingest.messageId);
```

Use trace first when debugging. It shows the raw-to-artifact path, processor
runs, webhook deliveries, and related audit events.

## 7. Operational Expectations

Internal projects should provide:

1. A stable upstream id in `connectorMessageId` or metadata.
2. A schema id for each custom processor artifact.
3. A retry strategy for `409`, `429`, and `5xx` responses.
4. A support link to the Carboti message trace for each downstream record.
5. Separate API clients for automation, operators, and agents.
