import { checkBindings } from "./deploy-preflight-binding-checks.mjs";
import { checkEmailConfig } from "./deploy-preflight-email-checks.mjs";
import { checkAppEnvAndPublicUrl } from "./deploy-preflight-url-checks.mjs";

export function createDeployPreflightResult({ config, target }) {
  const targetConfig = target === "local" ? config : config.env?.[target];
  if (!targetConfig) {
    return {
      errors: [],
      target,
      targetConfig: null,
      warnings: [],
    };
  }

  const result = {
    assets: targetConfig.assets ?? config.assets ?? null,
    d1Databases: targetConfig.d1_databases ?? config.d1_databases ?? [],
    errors: [],
    queues: targetConfig.queues ?? config.queues ?? {},
    sendEmail: targetConfig.send_email ?? config.send_email ?? [],
    target,
    targetConfig,
    vars: targetConfig.vars ?? {},
    warnings: [],
  };

  checkAppEnvAndPublicUrl(result);
  checkEmailConfig(result);
  checkBindings(result);

  return result;
}
