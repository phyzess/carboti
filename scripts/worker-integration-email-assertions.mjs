import { assert } from "./worker-integration-http.mjs";

export async function assertEmailMessage(env, { errorIncludes, kind, message, status }) {
  const email = await env.DB.prepare(
    "SELECT status, error_message FROM email_messages WHERE kind = ? LIMIT 1",
  )
    .bind(kind)
    .first();

  assert(email?.status === status, message);
  if (errorIncludes) {
    assert(email.error_message?.includes(errorIncludes), message);
  }

  return email;
}
