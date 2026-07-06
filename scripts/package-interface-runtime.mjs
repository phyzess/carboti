import { createRequire } from "node:module";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

export async function createPackageInterfaceRuntime({ root }) {
  const require = createRequire(import.meta.url);
  const vitePath = require.resolve("vite", {
    paths: [join(root, "apps", "web")],
  });
  const { createServer } = await import(pathToFileURL(vitePath));
  const server = await createServer({
    configFile: false,
    root,
    logLevel: "silent",
    server: {
      middlewareMode: true,
    },
  });

  try {
    const modules = {
      auth: await server.ssrLoadModule("/packages/auth/src/index.ts"),
      core: await server.ssrLoadModule("/packages/core/src/index.ts"),
      db: await server.ssrLoadModule("/packages/db/src/index.ts"),
      email: await server.ssrLoadModule("/packages/email/src/index.ts"),
      exampleImportReview: await server.ssrLoadModule("/examples/import-review/src/index.ts"),
      exampleJsonRecords: await server.ssrLoadModule("/examples/json-records/src/index.ts"),
      i18n: await server.ssrLoadModule("/packages/i18n/src/index.ts"),
      importPipeline: await server.ssrLoadModule("/packages/import-pipeline/src/index.ts"),
      rbac: await server.ssrLoadModule("/packages/rbac/src/index.ts"),
      templateFeature: await server.ssrLoadModule("/templates/feature/src/registry.ts"),
      webApi: await server.ssrLoadModule("/apps/web/src/api.ts"),
    };

    return { modules, server };
  } catch (error) {
    await server.close();
    throw error;
  }
}
