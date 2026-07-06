import { readFileSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { join } from "node:path";
import process from "node:process";
import { DatabaseSync } from "node:sqlite";
import { FakeD1Database } from "./worker-integration-fake-d1.mjs";
import { FakeEmailSender } from "./worker-integration-fake-email.mjs";
import { FakeQueue } from "./worker-integration-fake-queue.mjs";
import { FakeR2Bucket } from "./worker-integration-fake-r2.mjs";

const root = process.cwd();

export async function createTestEnv(overrides = {}) {
  const database = new DatabaseSync(":memory:");
  const migrationsPath = join(root, "apps", "worker", "migrations");
  const migrationNames = (await readdir(migrationsPath))
    .filter((name) => name.endsWith(".sql"))
    .sort();

  for (const migrationName of migrationNames) {
    database.exec(readFileSync(join(migrationsPath, migrationName), "utf8"));
  }

  const sourceFiles = new FakeR2Bucket();
  const importJobs = new FakeQueue();

  return {
    APP_ENV: "local",
    PUBLIC_APP_NAME: "carboti",
    PUBLIC_APP_URL: "http://localhost:5173",
    MAIL_FROM: "noreply@example.com",
    CARBOTI_SECRET_ENCRYPTION_KEY: "test-only-carboti-secret-encryption-key",
    DB: new FakeD1Database(database),
    EMAIL: new FakeEmailSender(),
    SOURCE_FILES: sourceFiles,
    IMPORT_JOBS: importJobs,
    ...overrides,
  };
}
