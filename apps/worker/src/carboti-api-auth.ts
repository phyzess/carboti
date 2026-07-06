import { hashSecret } from "@carboti/auth";
import { authError, type AppContext } from "./http-utils";

export type CarbotiApiScope =
  | "*"
  | "ingest:write"
  | "objects:read"
  | "artifacts:read"
  | "artifacts:write"
  | "lineage:read"
  | "processors:invoke"
  | "processors:write"
  | "replay:write"
  | "agent:read";

export type CarbotiApiClient = {
  id: string;
  name: string;
  scopes: string[];
  workspaceId: string;
};

type CarbotiApiClientRow = {
  id: string;
  name: string;
  scopes_json: string;
  workspace_id: string;
};

export async function requireCarbotiApiClient(
  context: AppContext,
  scope: CarbotiApiScope,
): Promise<
  | {
      client: CarbotiApiClient;
      ok: true;
    }
  | {
      ok: false;
      response: Response;
    }
> {
  const token = bearerToken(context);
  if (!token) {
    return {
      ok: false,
      response: authError(context, "missing_api_token", "Bearer API token is required.", 401),
    };
  }

  const tokenHash = await hashSecret(token);
  const row = await context.env.DB.prepare(
    `
      SELECT id, workspace_id, name, scopes_json
      FROM carboti_api_clients
      WHERE token_hash = ?
        AND status = 'active'
        AND revoked_at IS NULL
      LIMIT 1
    `,
  )
    .bind(tokenHash)
    .first<CarbotiApiClientRow>();

  if (!row) {
    return {
      ok: false,
      response: authError(context, "invalid_api_token", "API token is invalid.", 401),
    };
  }

  const client: CarbotiApiClient = {
    id: row.id,
    name: row.name,
    scopes: parseScopes(row.scopes_json),
    workspaceId: row.workspace_id,
  };

  if (!carbotiApiClientHasScope(client, scope)) {
    return {
      ok: false,
      response: authError(context, "insufficient_scope", "API token scope is insufficient.", 403),
    };
  }

  return {
    client,
    ok: true,
  };
}

export function apiClientActorId(client: CarbotiApiClient): string {
  return `api_client:${client.id}`;
}

function bearerToken(context: AppContext): string | null {
  const authorization = context.req.header("authorization");
  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  const token = authorization.slice("Bearer ".length).trim();
  return token.length > 0 ? token : null;
}

export function carbotiApiClientHasScope(
  client: CarbotiApiClient,
  scope: CarbotiApiScope,
): boolean {
  return client.scopes.includes("*") || client.scopes.includes(scope);
}

function parseScopes(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((scope): scope is string => typeof scope === "string");
  } catch {
    return [];
  }
}
