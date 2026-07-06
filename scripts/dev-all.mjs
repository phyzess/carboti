import { resolveDevAllConfig } from "./dev-all-config.mjs";
import { runDevAll } from "./dev-all-runner.mjs";

runDevAll(await resolveDevAllConfig());
