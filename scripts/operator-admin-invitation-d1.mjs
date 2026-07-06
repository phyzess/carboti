import { join } from "node:path";
import process from "node:process";

import { compactSql } from "./operator-admin-invitation-sql.mjs";
import { runObservedWranglerProcess } from "./wrangler-observed-process.mjs";

const root = process.cwd();

export function runD1(config, sql) {
  const timeoutMs = Number(process.env.WRANGLER_D1_EXECUTE_TIMEOUT_MS ?? 180_000);

  return runObservedWranglerProcess({
    args: ["d1", "execute", config.database, ...config.args, "--command", compactSql(sql)],
    cwd: join(root, "apps", "worker"),
    errorPrefix: "Wrangler D1 admin invitation insert",
    startErrorMessage: (error) => error.message,
    timeoutMessage: `Wrangler D1 admin invitation insert did not finish within ${timeoutMs}ms.`,
    timeoutMs,
  });
}
