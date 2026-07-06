export function createSmokeWorkerAuthContext({ text }) {
  const workerEmailDelivery = [
    text("apps/worker/src/email-delivery.ts"),
    text("apps/worker/src/email-delivery-send.ts"),
    text("apps/worker/src/email-delivery-store.ts"),
  ].join("\n");
  const workerAuthSession = [
    text("apps/worker/src/auth-session.ts"),
    text("apps/worker/src/auth-session-cookie.ts"),
    text("apps/worker/src/auth-session-current-user.ts"),
    text("apps/worker/src/auth-session-statements.ts"),
  ].join("\n");

  return {
    workerAuthSession,
    workerEmailDelivery,
  };
}
