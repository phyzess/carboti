import { isPlaceholder } from "./deploy-preflight-policy.mjs";

export function checkBindings(result) {
  if (
    !Array.isArray(result.sendEmail) ||
    !result.sendEmail.some((binding) => binding?.name === "EMAIL")
  ) {
    result.errors.push("send_email binding named EMAIL is required.");
  }

  const db = deployPreflightDatabase(result);
  if (!db) {
    result.errors.push("D1 binding named DB is required.");
  } else if (result.target !== "local" && isPlaceholder(db.database_id)) {
    result.errors.push("Remote D1 database_id must be replaced before deployment.");
  }

  const consumers = Array.isArray(result.queues.consumers) ? result.queues.consumers : [];
  if (!consumers.some((consumer) => consumer?.dead_letter_queue)) {
    result.errors.push("Import queue consumer must define a dead_letter_queue.");
  }

  if (result.target !== "local") {
    if (!result.assets?.directory || !result.assets?.run_worker_first?.includes("/api/*")) {
      result.errors.push(
        "Preview and production must serve web assets with the Worker handling /api/*.",
      );
    }
  }
}

export function deployPreflightDatabase(result) {
  return Array.isArray(result.d1Databases)
    ? result.d1Databases.find((database) => database?.binding === "DB")
    : null;
}
