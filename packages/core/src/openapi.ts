export const carbotiOpenApiDocument = {
  openapi: "3.1.0",
  info: {
    title: "Carboti API",
    version: "0.1.0",
    summary: "Raw-first data ingestion for emails, documents, and AI agents.",
  },
  jsonSchemaDialect: "https://json-schema.org/draft/2020-12/schema",
  tags: [
    {
      name: "Contract",
    },
    {
      name: "Ingest",
    },
    {
      name: "Evidence",
    },
    {
      name: "Processors",
    },
    {
      name: "Replay",
    },
    {
      name: "Agents",
    },
  ],
  components: {
    responses: {
      ApiError: {
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/ApiError",
            },
          },
        },
        description: "Structured API error.",
      },
    },
    securitySchemes: {
      bearerAuth: {
        scheme: "bearer",
        type: "http",
      },
    },
    schemas: {
      ApiError: {
        additionalProperties: true,
        properties: {
          code: {
            type: "string",
          },
          message: {
            type: "string",
          },
        },
        required: ["code", "message"],
        type: "object",
      },
      Artifact: {
        additionalProperties: true,
        properties: {
          id: {
            type: "string",
          },
          kind: {
            $ref: "#/components/schemas/ArtifactKind",
          },
          data: {},
          messageId: {
            type: "string",
          },
          processorRunId: {
            type: "string",
          },
          schemaId: {
            type: "string",
          },
        },
        required: ["id", "kind"],
        type: "object",
      },
      ArtifactKind: {
        enum: [
          "message_text",
          "message_html",
          "attachment_manifest",
          "normalized_json",
          "record",
          "table",
          "agent_context_bundle",
          "processor_output",
        ],
        type: "string",
      },
      CapabilityManifest: {
        additionalProperties: false,
        properties: {
          inputArtifactKinds: {
            items: {
              $ref: "#/components/schemas/ArtifactKind",
            },
            type: "array",
          },
          inputObjectKinds: {
            items: {
              $ref: "#/components/schemas/ObjectKind",
            },
            type: "array",
          },
          outputArtifactKinds: {
            items: {
              $ref: "#/components/schemas/ArtifactKind",
            },
            type: "array",
          },
          permissions: {
            items: {
              enum: ["read:message", "read:artifacts", "write:artifacts"],
              type: "string",
            },
            type: "array",
          },
        },
        type: "object",
      },
      LineageEdge: {
        additionalProperties: false,
        properties: {
          createdAt: {
            format: "date-time",
            type: "string",
          },
          fromObjectId: {
            type: "string",
          },
          id: {
            type: "string",
          },
          processorRunId: {
            type: "string",
          },
          relation: {
            enum: ["received_as", "contains", "normalized_to", "processed_into", "exported_as"],
            type: "string",
          },
          toObjectId: {
            type: "string",
          },
        },
        required: ["id", "fromObjectId", "toObjectId", "relation", "createdAt"],
        type: "object",
      },
      ObjectKind: {
        enum: [
          "raw_email",
          "raw_attachment",
          "raw_document",
          "normalized_message",
          "artifact",
          "export",
        ],
        type: "string",
      },
      StoredObject: {
        additionalProperties: true,
        properties: {
          id: {
            type: "string",
          },
          kind: {
            $ref: "#/components/schemas/ObjectKind",
          },
          contentType: {
            type: "string",
          },
          objectKey: {
            type: "string",
          },
          size: {
            type: "number",
          },
        },
        required: ["id", "kind"],
        type: "object",
      },
    },
  },
  paths: {
    "/api/carboti/contract": {
      get: {
        operationId: "getCarbotiContract",
        responses: {
          "200": {
            description: "Carboti kind registries and service metadata.",
          },
        },
        security: [],
        tags: ["Contract"],
      },
    },
    "/api/carboti/openapi.json": {
      get: {
        operationId: "getCarbotiOpenApi",
        responses: {
          "200": {
            description: "OpenAPI description for the public Carboti API.",
          },
        },
        security: [],
        tags: ["Contract"],
      },
    },
    "/api/carboti/ingest/http": {
      post: {
        operationId: "ingestHttpObject",
        parameters: [
          {
            in: "header",
            name: "x-carboti-filename",
            required: false,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          content: {
            "application/octet-stream": {
              schema: {
                format: "binary",
                type: "string",
              },
            },
            "text/plain": {
              schema: {
                type: "string",
              },
            },
          },
          required: true,
        },
        responses: {
          "202": {
            description: "Raw input accepted and preserved.",
          },
          "401": {
            $ref: "#/components/responses/ApiError",
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        tags: ["Ingest"],
      },
    },
    "/api/carboti/objects/{objectId}": {
      get: {
        operationId: "getObject",
        parameters: [
          {
            in: "path",
            name: "objectId",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          "200": {
            description: "Stored object metadata and parsed inline data when available.",
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        tags: ["Evidence"],
      },
    },
    "/api/carboti/artifacts/{artifactId}": {
      get: {
        operationId: "getArtifact",
        parameters: [
          {
            in: "path",
            name: "artifactId",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          "200": {
            description: "Artifact metadata and inline data.",
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        tags: ["Evidence"],
      },
    },
    "/api/carboti/messages/{messageId}/artifacts": {
      get: {
        operationId: "listMessageArtifacts",
        parameters: [
          {
            in: "path",
            name: "messageId",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          "200": {
            description: "Artifacts associated with a message.",
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        tags: ["Evidence"],
      },
      post: {
        operationId: "submitMessageArtifact",
        parameters: [
          {
            in: "path",
            name: "messageId",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                additionalProperties: true,
                properties: {
                  contentType: {
                    type: "string",
                  },
                  data: {},
                  kind: {
                    $ref: "#/components/schemas/ArtifactKind",
                  },
                  schemaId: {
                    type: "string",
                  },
                },
                required: ["data", "kind"],
                type: "object",
              },
            },
          },
          required: true,
        },
        responses: {
          "201": {
            description: "External artifact accepted and linked to the message.",
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        tags: ["Processors"],
      },
    },
    "/api/carboti/messages/{messageId}/lineage": {
      get: {
        operationId: "getMessageLineage",
        parameters: [
          {
            in: "path",
            name: "messageId",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          "200": {
            description: "Lineage edges for a message.",
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        tags: ["Evidence"],
      },
    },
    "/api/carboti/messages/{messageId}/replay": {
      post: {
        operationId: "replayMessage",
        parameters: [
          {
            in: "path",
            name: "messageId",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          "201": {
            description: "Replay completed or queued from preserved raw input.",
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        tags: ["Replay"],
      },
    },
    "/api/carboti/processors/external": {
      post: {
        operationId: "createExternalProcessor",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                additionalProperties: false,
                properties: {
                  capabilityManifest: {
                    $ref: "#/components/schemas/CapabilityManifest",
                  },
                  endpointUrl: {
                    format: "uri",
                    type: "string",
                  },
                  name: {
                    type: "string",
                  },
                  signingSecret: {
                    minLength: 16,
                    type: "string",
                    writeOnly: true,
                  },
                  timeoutSeconds: {
                    maximum: 60,
                    minimum: 1,
                    type: "number",
                  },
                },
                required: ["endpointUrl", "name", "signingSecret"],
                type: "object",
              },
            },
          },
          required: true,
        },
        responses: {
          "201": {
            description: "External processor created.",
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        tags: ["Processors"],
      },
    },
    "/api/carboti/processors/{processorId}/invoke": {
      post: {
        operationId: "invokeExternalProcessor",
        parameters: [
          {
            in: "path",
            name: "processorId",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                additionalProperties: false,
                properties: {
                  messageId: {
                    type: "string",
                  },
                },
                required: ["messageId"],
                type: "object",
              },
            },
          },
          required: true,
        },
        responses: {
          "201": {
            description: "Processor invoked and returned artifacts were stored.",
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        tags: ["Processors"],
      },
    },
    "/api/carboti/processor-deliveries/{deliveryId}/retry": {
      post: {
        operationId: "retryProcessorDelivery",
        parameters: [
          {
            in: "path",
            name: "deliveryId",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          "201": {
            description: "Failed processor delivery retried.",
          },
          "409": {
            $ref: "#/components/responses/ApiError",
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        tags: ["Processors"],
      },
    },
    "/api/carboti/agent/artifacts/search": {
      post: {
        operationId: "agentSearchArtifacts",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                additionalProperties: false,
                properties: {
                  kinds: {
                    items: {
                      $ref: "#/components/schemas/ArtifactKind",
                    },
                    type: "array",
                  },
                  limit: {
                    maximum: 20,
                    minimum: 1,
                    type: "number",
                  },
                  messageId: {
                    type: "string",
                  },
                  query: {
                    type: "string",
                  },
                },
                type: "object",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Agent-safe artifact metadata without raw object bytes.",
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        tags: ["Agents"],
      },
    },
    "/api/carboti/agent/artifacts/{artifactId}/inspect": {
      get: {
        operationId: "agentInspectArtifact",
        parameters: [
          {
            in: "path",
            name: "artifactId",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          "200": {
            description: "Agent-safe artifact metadata with a bounded data preview.",
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        tags: ["Agents"],
      },
    },
    "/api/carboti/agent/artifacts/{artifactId}/access": {
      post: {
        operationId: "agentCreateArtifactAccess",
        parameters: [
          {
            in: "path",
            name: "artifactId",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                additionalProperties: false,
                properties: {
                  ttlSeconds: {
                    maximum: 900,
                    minimum: 1,
                    type: "number",
                  },
                },
                type: "object",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Created a short-lived signed artifact access token.",
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        tags: ["Agents"],
      },
    },
    "/api/carboti/agent/artifact-access/{token}": {
      get: {
        operationId: "agentReadSignedArtifact",
        parameters: [
          {
            in: "path",
            name: "token",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          "200": {
            description: "Artifact data authorized by a short-lived signed token.",
          },
          "410": {
            $ref: "#/components/responses/ApiError",
          },
        },
        security: [],
        tags: ["Agents"],
      },
    },
    "/api/carboti/agent/messages/{messageId}/context": {
      post: {
        operationId: "agentCreateContextBundle",
        parameters: [
          {
            in: "path",
            name: "messageId",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          "201": {
            description: "Created an agent_context_bundle artifact from eligible artifacts.",
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        tags: ["Agents"],
      },
    },
    "/api/carboti/mcp": {
      post: {
        operationId: "carbotiMcp",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                additionalProperties: true,
                type: "object",
              },
            },
          },
        },
        responses: {
          "200": {
            description:
              "MCP JSON-RPC endpoint exposing search, inspect, retrieve, and replay tools.",
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        tags: ["Agents"],
      },
    },
  },
} as const;

export type CarbotiOpenApiDocument = typeof carbotiOpenApiDocument;
