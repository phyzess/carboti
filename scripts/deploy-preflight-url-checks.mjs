import {
  isExampleDomain,
  isLocalHostname,
  isWorkersDev,
  stringValue,
} from "./deploy-preflight-policy.mjs";

export function checkAppEnvAndPublicUrl(result) {
  checkAppEnv(result);
  checkPublicAppUrl(result);
}

function checkAppEnv(result) {
  const expected = result.target === "local" ? "local" : result.target;
  if (result.vars.APP_ENV !== expected) {
    result.errors.push(`APP_ENV must be "${expected}" for ${result.target}.`);
  }
}

function checkPublicAppUrl(result) {
  const value = stringValue(result.vars.PUBLIC_APP_URL);
  if (!value) {
    result.errors.push("PUBLIC_APP_URL is required.");
    return;
  }

  let url;
  try {
    url = new URL(value);
  } catch {
    result.errors.push("PUBLIC_APP_URL must be an absolute URL.");
    return;
  }

  const hostname = url.hostname.toLowerCase();
  if (result.target !== "local") {
    if (url.protocol !== "https:") {
      result.errors.push("PUBLIC_APP_URL must use https outside local development.");
    }

    if (isLocalHostname(hostname)) {
      result.errors.push("PUBLIC_APP_URL must not point to localhost outside local development.");
    }

    if (isExampleDomain(hostname)) {
      result.errors.push("PUBLIC_APP_URL must be replaced before preview or production.");
    }

    if (isWorkersDev(hostname)) {
      result.errors.push("PUBLIC_APP_URL must be the public custom origin, not workers.dev.");
    }
  }
}
