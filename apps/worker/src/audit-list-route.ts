import type { Hono } from "hono";
import { readCurrentUser } from "./auth-routes";
import { authError, parseQueryLimit } from "./http-utils";
import { publicAuditEvent } from "./audit-presenters";
import { readAuditEvents } from "./audit-query";

export function registerAuditListRoute(app: Hono<{ Bindings: Env }>): void {
  app.get("/api/audit-events", async (context) => {
    const current = await readCurrentUser(context);
    if (!current) {
      return authError(context, "unauthorized", "Login is required.", 401);
    }

    const occurredAfter = parseIsoDateTimeQuery(context.req.query("occurredAfter"));
    const occurredBefore = parseIsoDateTimeQuery(context.req.query("occurredBefore"));
    if (occurredAfter === false || occurredBefore === false) {
      return context.json(
        {
          error: {
            code: "invalid_audit_date_filter",
            message: "Audit date filters must be valid ISO date-time values.",
          },
        },
        400,
      );
    }

    const auditEvents = await readAuditEvents(context.env, {
      action: context.req.query("action") ?? null,
      actorId: context.req.query("actorId") ?? null,
      limit: parseQueryLimit(context.req.query("limit"), 50),
      occurredAfter,
      occurredBefore,
      subjectId: context.req.query("subjectId") ?? null,
      subjectKind: context.req.query("subjectKind") ?? null,
    });

    return context.json({
      auditEvents: auditEvents.map(publicAuditEvent),
    });
  });
}

function parseIsoDateTimeQuery(value: string | undefined): string | null | false {
  if (!value) return null;
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? false : new Date(timestamp).toISOString();
}
