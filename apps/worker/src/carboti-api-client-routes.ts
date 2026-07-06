import { createAuditEvent } from "@carboti/audit";
import { hashSecret } from "@carboti/auth";
import type { Hono } from "hono";
import * as v from "valibot";
import { prepareAuditInsert } from "./audit-store";
import {
  apiClientActorId,
  carbotiApiClientHasScope,
  carbotiApiScopes,
  requireCarbotiApiClient,
  type CarbotiApiClient,
} from "./carboti-api-auth";
import { authError, parseRequestJson, type AppContext } from "./http-utils";

const CreateApiClientInputSchema = v.object({
  name: v.pipe(v.string(), v.minLength(1)),
  scopes: v.pipe(v.array(v.string()), v.minLength(1)),
});

type CreateApiClientInput = v.InferOutput<typeof CreateApiClientInputSchema>;

type ApiClientRow = {
  created_at: string;
  id: string;
  name: string;
  revoked_at: string | null;
  scopes_json: string;
  status: string;
  workspace_id: string;
};

export function registerCarbotiApiClientRoutes(app: Hono<{ Bindings: Env }>): void {
  app.get("/api/carboti/api-clients", async (context) => {
    const auth = await requireCarbotiApiClient(context, "api_clients:read");
    if (!auth.ok) return auth.response;

    const result = await context.env.DB.prepare(
      `
        SELECT id, workspace_id, name, scopes_json, status, created_at, revoked_at
        FROM carboti_api_clients
        WHERE workspace_id = ?
        ORDER BY created_at DESC
        LIMIT 100
      `,
    )
      .bind(auth.client.workspaceId)
      .all<ApiClientRow>();

    return context.json({
      apiClients: result.results.map(presentApiClient),
    });
  });

  app.post("/api/carboti/api-clients", async (context) => {
    const auth = await requireCarbotiApiClient(context, "api_clients:write");
    if (!auth.ok) return auth.response;

    const parsed = await parseRequestJson(context, CreateApiClientInputSchema);
    if (!parsed.ok) return parsed.response;

    return createApiClient(context, {
      client: auth.client,
      input: parsed.value,
    });
  });

  app.post("/api/carboti/api-clients/:clientId/revoke", async (context) => {
    const auth = await requireCarbotiApiClient(context, "api_clients:write");
    if (!auth.ok) return auth.response;

    return revokeApiClient(context, {
      client: auth.client,
      clientId: context.req.param("clientId"),
    });
  });
}

async function createApiClient(
  context: AppContext,
  input: {
    client: CarbotiApiClient;
    input: CreateApiClientInput;
  },
): Promise<Response> {
  const scopes = [...new Set(input.input.scopes)];
  const invalidScope = scopes.find((scope) => !isValidScope(scope));
  if (invalidScope) {
    return authError(context, "api_client_scope_invalid", `Unknown scope "${invalidScope}".`, 400);
  }

  const ungrantableScope = scopes.find((scope) => !canGrantScope(input.client, scope));
  if (ungrantableScope) {
    return authError(
      context,
      "api_client_scope_not_grantable",
      `Current API client cannot grant "${ungrantableScope}".`,
      403,
    );
  }

  const now = new Date().toISOString();
  const id = `api-client:${crypto.randomUUID()}`;
  const token = `cbt_${randomToken()}`;

  await context.env.DB.batch([
    context.env.DB.prepare(
      `
        INSERT INTO carboti_api_clients (
          id,
          workspace_id,
          name,
          token_hash,
          scopes_json,
          status,
          created_at,
          revoked_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
    ).bind(
      id,
      input.client.workspaceId,
      input.input.name,
      await hashSecret(token),
      JSON.stringify(scopes),
      "active",
      now,
      null,
    ),
    prepareAuditInsert(
      context.env,
      createAuditEvent({
        action: "carboti.api_client.created",
        actor: {
          id: apiClientActorId(input.client),
          kind: "system",
        },
        metadata: {
          scopes,
        },
        subject: {
          id,
          kind: "carboti_api_client",
        },
      }),
    ),
  ]);

  return context.json(
    {
      apiClient: {
        createdAt: now,
        id,
        name: input.input.name,
        revokedAt: null,
        scopes,
        status: "active",
        workspaceId: input.client.workspaceId,
      },
      token,
      tokenPreview: previewToken(token),
    },
    201,
  );
}

async function revokeApiClient(
  context: AppContext,
  input: {
    client: CarbotiApiClient;
    clientId: string;
  },
): Promise<Response> {
  if (input.client.id === input.clientId) {
    return authError(
      context,
      "api_client_self_revoke_denied",
      "Use a different API client to revoke the current token.",
      409,
    );
  }

  const existing = await context.env.DB.prepare(
    `
      SELECT id, workspace_id, name, scopes_json, status, created_at, revoked_at
      FROM carboti_api_clients
      WHERE id = ?
        AND workspace_id = ?
      LIMIT 1
    `,
  )
    .bind(input.clientId, input.client.workspaceId)
    .first<ApiClientRow>();
  if (!existing) {
    return authError(context, "api_client_not_found", "API client was not found.", 404);
  }

  const now = new Date().toISOString();
  await context.env.DB.batch([
    context.env.DB.prepare(
      `
        UPDATE carboti_api_clients
        SET status = ?, revoked_at = ?
        WHERE id = ?
          AND workspace_id = ?
      `,
    ).bind("revoked", now, input.clientId, input.client.workspaceId),
    prepareAuditInsert(
      context.env,
      createAuditEvent({
        action: "carboti.api_client.revoked",
        actor: {
          id: apiClientActorId(input.client),
          kind: "system",
        },
        metadata: {
          revokedAt: now,
        },
        subject: {
          id: input.clientId,
          kind: "carboti_api_client",
        },
      }),
    ),
  ]);

  return context.json({
    apiClient: {
      ...presentApiClient(existing),
      revokedAt: now,
      status: "revoked",
    },
  });
}

function presentApiClient(row: ApiClientRow): Record<string, unknown> {
  return {
    createdAt: row.created_at,
    id: row.id,
    name: row.name,
    revokedAt: row.revoked_at,
    scopes: parseScopes(row.scopes_json),
    status: row.status,
    workspaceId: row.workspace_id,
  };
}

function isValidScope(scope: string): boolean {
  return (carbotiApiScopes as readonly string[]).includes(scope);
}

function canGrantScope(client: CarbotiApiClient, scope: string): boolean {
  return carbotiApiClientHasScope(client, "*") || client.scopes.includes(scope);
}

function parseScopes(value: string): string[] {
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((scope): scope is string => typeof scope === "string")
      : [];
  } catch {
    return [];
  }
}

function randomToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function previewToken(token: string): string {
  return `${token.slice(0, 8)}...${token.slice(-4)}`;
}
