import { createRequire } from "node:module";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import process from "node:process";
import { createTestEnv } from "./worker-integration-env.mjs";
import { createClient } from "./worker-integration-http.mjs";
import { testCarbotiHttpIngestAndReplay } from "./worker-integration-carboti-api.mjs";
import { testInboundEmailIntake } from "./worker-integration-inbound-email.mjs";
import { testAuditFilters } from "./worker-integration-audit.mjs";
import { testAuthBootstrapAndMembers } from "./worker-integration-auth.mjs";
import { testImportReviewWorkflow } from "./worker-integration-import-review.mjs";

const root = process.cwd();
const require = createRequire(import.meta.url);
const vitePath = require.resolve("vite", {
  paths: [join(root, "apps", "web")],
});
const { createServer } = await import(pathToFileURL(vitePath));

const aliases = [
  "ai-advisory",
  "audit",
  "auth",
  "charts",
  "config",
  "core",
  "db",
  "design-system",
  "email",
  "files",
  "import-pipeline",
  "jobs",
  "rbac",
  "testing",
  "ui",
].map((name) => ({
  find: `@carboti/${name}`,
  replacement: join(root, "packages", name, "src", "index.ts"),
}));

async function main() {
  const server = await createServer({
    configFile: false,
    root,
    logLevel: "silent",
    server: {
      middlewareMode: true,
    },
    resolve: {
      alias: aliases,
    },
  });

  try {
    const workerModule = await server.ssrLoadModule("/apps/worker/src/index.ts");
    const worker = workerModule.default;
    const env = await createTestEnv();
    const client = createClient(worker, env);

    await testInboundEmailIntake(worker);
    const { loginAfterReset } = await testAuthBootstrapAndMembers({ client, env, worker });

    const { upload } = await testImportReviewWorkflow({ client, env, worker });
    await testAuditFilters({ client, loginAfterReset, upload });
    await testCarbotiHttpIngestAndReplay({ client, env });

    console.log("Worker integration passed.");
  } finally {
    await server.close();
  }
}

await main();
