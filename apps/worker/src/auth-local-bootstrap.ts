import { EmailSchema, PasswordSchema } from "@carboti/auth";
import * as v from "valibot";
import { bootstrapLocalUser, type LocalUserBootstrapOptions } from "./auth-local-bootstrap-record";
import { publicSession } from "./auth-presenters";
import { writeSessionCookie } from "./auth-session";
import { isLocalRuntime } from "./auth-local-runtime";
import { authError, parseRequestJson, type AppContext } from "./http-utils";

const LocalUserBootstrapInputSchema = v.object({
  email: EmailSchema,
  displayName: v.optional(v.string()),
  password: PasswordSchema,
});

export async function createLocalUserBootstrapResponse(
  context: AppContext,
  options: LocalUserBootstrapOptions,
): Promise<Response> {
  if (!isLocalRuntime(context)) {
    return authError(context, "bootstrap_disabled", "Local user bootstrap is local-only.", 403);
  }

  const input = await parseRequestJson(context, LocalUserBootstrapInputSchema);
  if (!input.ok) return input.response;

  const bootstrap = await bootstrapLocalUser({
    context,
    displayName: input.value.displayName,
    email: input.value.email,
    options,
    password: input.value.password,
  });
  writeSessionCookie(context, bootstrap.token, bootstrap.session.expiresAt);

  return context.json(
    {
      user: bootstrap.user,
      session: publicSession(bootstrap.session),
      created: bootstrap.created,
    },
    bootstrap.created ? 201 : 200,
  );
}
