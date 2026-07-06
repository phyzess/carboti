import type { Context } from "hono";
import * as v from "valibot";

export type AppContext = Context<{ Bindings: Env }>;

export async function parseRequestJson<TSchema extends v.GenericSchema>(
  context: AppContext,
  schema: TSchema,
): Promise<
  | {
      ok: true;
      body: unknown;
      value: v.InferOutput<TSchema>;
    }
  | {
      ok: false;
      response: Response;
    }
> {
  let body: unknown;

  try {
    body = await context.req.json();
  } catch {
    return {
      ok: false,
      response: context.json(
        {
          error: {
            code: "invalid_json",
            message: "Request body must be valid JSON.",
          },
        },
        400,
      ),
    };
  }

  const result = v.safeParse(schema, body);
  if (result.success) {
    return {
      body,
      ok: true,
      value: result.output,
    };
  }

  const issues = result.issues.map((issue) => ({
    message: issue.message,
    path: issue.path?.map((item) => item.key).join("."),
  }));

  return {
    ok: false,
    response: context.json(
      {
        error: {
          code: "invalid_request",
          message: issues[0]?.message ?? "Request body is invalid.",
          issues,
        },
      },
      400,
    ),
  };
}

export function authError(
  context: AppContext,
  code: string,
  message: string,
  status: 400 | 401 | 403 | 404 | 409 | 410 | 500,
): Response {
  return context.json(
    {
      error: {
        code,
        message,
      },
    },
    status,
  );
}

export function parseQueryLimit(value: string | undefined, fallback: number): number {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) {
    return fallback;
  }

  return Math.min(parsed, 100);
}
