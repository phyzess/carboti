import { resolveLocalD1MigrationConfig } from "./wrangler-d1-migrate-local-config.mjs";
import { runLocalD1Migration } from "./wrangler-d1-migrate-local-runner.mjs";

runLocalD1Migration(resolveLocalD1MigrationConfig());
