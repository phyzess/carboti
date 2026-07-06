import { assertWorkerAdvisoryGuards } from "./smoke-worker-advisory-guards.mjs";
import { assertWorkerAuthGuards } from "./smoke-worker-auth-guards.mjs";
import { assertWorkerImportReviewGuards } from "./smoke-worker-import-review-guards.mjs";
import { assertWorkerSchemaGuards } from "./smoke-worker-schema-guards.mjs";
import { assertWorkerSourceGuards } from "./smoke-worker-source-guards.mjs";

export function assertWorkerRuntimeGuards(context) {
  assertWorkerSchemaGuards(context);
  assertWorkerAuthGuards(context);
  assertWorkerSourceGuards(context);
  assertWorkerImportReviewGuards(context);
  assertWorkerAdvisoryGuards(context);

  const { assert, text, workerSources } = context;

  assert(
    workerSources.includes('app.get("/api/source-files"') &&
      workerSources.includes('app.get("/api/import-jobs"') &&
      workerSources.includes('app.get("/api/audit-events"') &&
      workerSources.includes('app.get("/api/users"') &&
      workerSources.includes('app.get("/api/invitations"'),
    "worker must expose source file, import job, audit, user, and invitation list routes.",
  );
  assert(
    text("apps/worker/vitest.config.ts").includes("cloudflareTest") &&
      text("apps/worker/vitest.config.ts").includes("./wrangler.jsonc") &&
      text("apps/worker/test/tsconfig.json").includes("@cloudflare/vitest-pool-workers/types") &&
      text("apps/worker/test/worker-runtime.test.ts").includes("cloudflare:workers") &&
      text("apps/worker/test/worker-runtime.test.ts").includes("exports.default.fetch") &&
      text("apps/worker/test/worker-runtime.test.ts").includes("/health") &&
      text("apps/worker/test/worker-runtime.test.ts").includes("/api/source-files"),
    "Worker runtime tests must use the official Cloudflare Vitest pool and cover health plus unauthenticated upload.",
  );
}
