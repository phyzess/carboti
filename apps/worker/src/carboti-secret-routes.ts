import { createAuditEvent } from "@carboti/audit";
import type { Hono } from "hono";
import * as v from "valibot";
import { prepareAuditInsert } from "./audit-store";
import {
  apiClientActorId,
  requireCarbotiApiClient,
  type CarbotiApiClient,
} from "./carboti-api-auth";
import { encryptCarbotiSecret } from "./carboti-secret-store";
import { authError, parseRequestJson, type AppContext } from "./http-utils";

const CreateSecretInputSchema = v.object({
  description: v.optional(v.string()),
  kind: v.picklist(["connector_credential", "processor_signing_key", "generic"]),
  name: v.pipe(v.string(), v.minLength(1)),
  plaintext: v.pipe(v.string(), v.minLength(1)),
});

type CreateSecretInput = v.InferOutput<typeof CreateSecretInputSchema>;

type SecretRow = {
  created_at: string;
  description: string | null;
  id: string;
  kind: string;
  key_version: string;
  name: string | null;
  status: string | null;
  updated_at: string;
  workspace_id: string;
};

export function registerCarbotiSecretRoutes(app: Hono<{ Bindings: Env }>): void {
  app.get("/api/carboti/secrets", async (context) => {
    const auth = await requireCarbotiApiClient(context, "secrets:read");
    if (!auth.ok) return auth.response;

    const result = await context.env.DB.prepare(
      `
        SELECT
          id,
          workspace_id,
          kind,
          key_version,
          name,
          description,
          status,
          created_at,
          updated_at
        FROM carboti_secret_refs
        WHERE workspace_id = ?
        ORDER BY created_at DESC
        LIMIT 100
      `,
    )
      .bind(auth.client.workspaceId)
      .all<SecretRow>();

    return context.json({
      secrets: result.results.map(presentSecret),
    });
  });

  app.post("/api/carboti/secrets", async (context) => {
    const auth = await requireCarbotiApiClient(context, "secrets:write");
    if (!auth.ok) return auth.response;

    const parsed = await parseRequestJson(context, CreateSecretInputSchema);
    if (!parsed.ok) return parsed.response;

    return createSecret(context, {
      client: auth.client,
      input: parsed.value,
    });
  });

  app.post("/api/carboti/secrets/:secretRef/revoke", async (context) => {
    const auth = await requireCarbotiApiClient(context, "secrets:write");
    if (!auth.ok) return auth.response;

    return revokeSecret(context, {
      client: auth.client,
      secretRef: context.req.param("secretRef"),
    });
  });
}

async function createSecret(
  context: AppContext,
  input: {
    client: CarbotiApiClient;
    input: CreateSecretInput;
  },
): Promise<Response> {
  const now = new Date().toISOString();
  const secretRef = `secret:${input.input.kind}:${crypto.randomUUID()}`;
  let encrypted;
  try {
    encrypted = await encryptCarbotiSecret(context.env, input.input.plaintext);
  } catch {
    return authError(
      context,
      "secret_store_unavailable",
      "Secret encryption is not configured.",
      409,
    );
  }

  await context.env.DB.batch([
    context.env.DB.prepare(
      `
        INSERT INTO carboti_secret_refs (
          id,
          workspace_id,
          kind,
          algorithm,
          key_version,
          iv,
          ciphertext,
          name,
          description,
          status,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
    ).bind(
      secretRef,
      input.client.workspaceId,
      input.input.kind,
      encrypted.algorithm,
      encrypted.keyVersion,
      encrypted.iv,
      encrypted.ciphertext,
      input.input.name,
      input.input.description ?? null,
      "active",
      now,
      now,
    ),
    prepareAuditInsert(
      context.env,
      createAuditEvent({
        action: "carboti.secret.created",
        actor: {
          id: apiClientActorId(input.client),
          kind: "system",
        },
        metadata: {
          kind: input.input.kind,
          name: input.input.name,
        },
        subject: {
          id: secretRef,
          kind: "carboti_secret_ref",
        },
      }),
    ),
  ]);

  return context.json(
    {
      secret: {
        createdAt: now,
        description: input.input.description ?? null,
        id: secretRef,
        keyVersion: encrypted.keyVersion,
        kind: input.input.kind,
        name: input.input.name,
        status: "active",
        updatedAt: now,
        workspaceId: input.client.workspaceId,
      },
    },
    201,
  );
}

async function revokeSecret(
  context: AppContext,
  input: {
    client: CarbotiApiClient;
    secretRef: string;
  },
): Promise<Response> {
  const existing = await context.env.DB.prepare(
    `
      SELECT
        id,
        workspace_id,
        kind,
        key_version,
        name,
        description,
        status,
        created_at,
        updated_at
      FROM carboti_secret_refs
      WHERE id = ?
        AND workspace_id = ?
      LIMIT 1
    `,
  )
    .bind(input.secretRef, input.client.workspaceId)
    .first<SecretRow>();
  if (!existing) {
    return authError(context, "secret_not_found", "Secret ref was not found.", 404);
  }

  const now = new Date().toISOString();
  await context.env.DB.batch([
    context.env.DB.prepare(
      `
        UPDATE carboti_secret_refs
        SET status = ?, updated_at = ?
        WHERE id = ?
          AND workspace_id = ?
      `,
    ).bind("revoked", now, input.secretRef, input.client.workspaceId),
    prepareAuditInsert(
      context.env,
      createAuditEvent({
        action: "carboti.secret.revoked",
        actor: {
          id: apiClientActorId(input.client),
          kind: "system",
        },
        metadata: {
          revokedAt: now,
        },
        subject: {
          id: input.secretRef,
          kind: "carboti_secret_ref",
        },
      }),
    ),
  ]);

  return context.json({
    secret: {
      ...presentSecret(existing),
      status: "revoked",
      updatedAt: now,
    },
  });
}

function presentSecret(row: SecretRow): Record<string, unknown> {
  return {
    createdAt: row.created_at,
    description: row.description,
    id: row.id,
    keyVersion: row.key_version,
    kind: row.kind,
    name: row.name,
    status: row.status ?? "active",
    updatedAt: row.updated_at,
    workspaceId: row.workspace_id,
  };
}
