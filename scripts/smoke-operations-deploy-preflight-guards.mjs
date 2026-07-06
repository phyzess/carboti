export function assertOperationsDeployPreflightGuards(context) {
  const { assert, deployPreflight } = context;

  assert(
    deployPreflight.includes("PUBLIC_APP_URL must be the public custom origin") &&
      deployPreflight.includes("EMAIL_DELIVERY_MODE must be send") &&
      deployPreflight.includes("Remote D1 database_id must be replaced") &&
      deployPreflight.includes("send_email binding named EMAIL") &&
      deployPreflight.includes("dead_letter_queue"),
    "deploy preflight must check public origins, email sending mode, D1 placeholders, Email binding, and DLQ.",
  );
}
