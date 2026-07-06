import process from "node:process";

export function resolveHealthCheckTarget({ config, options }) {
  const expectedEnvironment = options.expectedEnvironment ?? config?.expectedEnvironment ?? null;
  const rawUrl = options.url ?? firstConfiguredUrl(config) ?? config?.fallbackUrl;

  if (!rawUrl) {
    const expectedVars = config?.envVars.filter((name) => name !== "QITU_HEALTH_URL") ?? [];
    throw new Error(
      `Missing health URL for ${options.target}. Set ${expectedVars.join(" or ")} or pass --url.`,
    );
  }

  return {
    expectedEnvironment,
    healthUrl: toHealthUrl(rawUrl),
  };
}

export function firstConfiguredUrl(config, env = process.env) {
  if (!config) return null;

  for (const envVar of config.envVars) {
    const value = env[envVar]?.trim();
    if (value) return value;
  }

  return null;
}

export function toHealthUrl(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`Invalid health URL: ${value}`);
  }

  const path = url.pathname.replace(/\/$/, "");
  url.pathname = path.endsWith("/health") ? path : `${path}/health`;
  url.search = "";
  url.hash = "";
  return url.toString();
}
