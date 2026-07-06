import process from "node:process";

export const targets = {
  local: {
    database: "carboti-dev",
    args: ["--local"],
    appUrlEnv: ["QITU_LOCAL_APP_URL", "QITU_PUBLIC_APP_URL"],
    fallbackAppUrl: "http://localhost:5173",
  },
  preview: {
    database: "carboti-preview",
    args: ["--env", "preview", "--remote"],
    appUrlEnv: ["QITU_PREVIEW_APP_URL", "QITU_PUBLIC_APP_URL"],
    fallbackAppUrl: null,
  },
  production: {
    database: "carboti-production",
    args: ["--env", "production", "--remote"],
    appUrlEnv: ["QITU_PRODUCTION_APP_URL", "QITU_PUBLIC_APP_URL"],
    fallbackAppUrl: null,
  },
};

export function firstConfiguredUrl(config) {
  for (const envVar of config.appUrlEnv) {
    const value = process.env[envVar]?.trim();
    if (value) return value;
  }

  return null;
}

export function publicAppUrlValidationError(value, target) {
  let url;
  try {
    url = new URL(value);
  } catch {
    return "PUBLIC_APP_URL must be an absolute URL.";
  }

  if (target === "local") {
    return null;
  }

  const hostname = url.hostname.toLowerCase();
  if (url.protocol !== "https:") {
    return "PUBLIC_APP_URL must use https outside local development.";
  }

  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1" ||
    hostname === "[::1]" ||
    hostname.endsWith(".localhost")
  ) {
    return "PUBLIC_APP_URL must not point to localhost outside local development.";
  }

  if (hostname === "example.com" || hostname.endsWith(".example.com")) {
    return "PUBLIC_APP_URL must be replaced before preview or production.";
  }

  if (hostname === "workers.dev" || hostname.endsWith(".workers.dev")) {
    return "PUBLIC_APP_URL must be the public app origin, not a workers.dev diagnostic URL.";
  }

  return null;
}
