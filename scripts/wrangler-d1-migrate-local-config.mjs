import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";

export const noMigrationsMarker = "No migrations to apply!";
export const finalMigrationName = "0007_event_foundations.sql";
export const timeoutMs = 120_000;

export function resolveLocalD1MigrationConfig(env = process.env, platform = process.platform) {
  const root = dirname(dirname(fileURLToPath(import.meta.url)));
  const args = ["d1", "migrations", "apply", "carboti-dev", "--local"];

  if (env.QITU_D1_PERSIST_TO) {
    args.push("--persist-to", env.QITU_D1_PERSIST_TO);
  }

  return {
    args,
    env,
    finalMigrationName,
    noMigrationsMarker,
    timeoutMs,
    workerDir: join(root, "apps", "worker"),
    wrangler: platform === "win32" ? "wrangler.cmd" : "wrangler",
  };
}
