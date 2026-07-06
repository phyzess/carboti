import { parseRuntimeConfig, type EmailDeliveryMode } from "@carboti/config";

export class PublicAppUrlConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PublicAppUrlConfigError";
  }
}

export function runtimeConfig(env: Env) {
  return parseRuntimeConfig({
    APP_ENV: env.APP_ENV,
    EMAIL_DELIVERY_MODE: env.EMAIL_DELIVERY_MODE || undefined,
    MAIL_FROM: env.MAIL_FROM || undefined,
    MAIL_REPLY_TO: env.MAIL_REPLY_TO || undefined,
    PUBLIC_APP_NAME: env.PUBLIC_APP_NAME || undefined,
    PUBLIC_APP_URL: env.PUBLIC_APP_URL || undefined,
  });
}

export function appName(env: Env): string {
  return runtimeConfig(env).PUBLIC_APP_NAME ?? "carboti";
}

export function buildAppUrl(env: Env, path: string): string {
  return buildPublicUrl(env, path);
}

export function buildPublicUrl(env: Env, path: string): string {
  return new URL(path, publicAppUrl(env)).toString();
}

export function publicAppUrl(env: Env): string {
  const config = runtimeConfig(env);
  const baseUrl =
    config.PUBLIC_APP_URL ?? (config.APP_ENV === "local" ? "http://localhost:5173" : "");
  const validationError = publicAppUrlValidationError(baseUrl, config.APP_ENV);

  if (validationError) {
    throw new PublicAppUrlConfigError(validationError);
  }

  return new URL(baseUrl).origin;
}

export function publicAppUrlValidationError(
  value: string | undefined,
  appEnv: "local" | "preview" | "production",
): string | null {
  if (!value?.trim()) {
    return appEnv === "local" ? null : "PUBLIC_APP_URL is required outside local development.";
  }

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return "PUBLIC_APP_URL must be an absolute URL.";
  }

  const hostname = url.hostname.toLowerCase();

  if (appEnv !== "local") {
    if (url.protocol !== "https:") {
      return "PUBLIC_APP_URL must use https outside local development.";
    }

    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "::1" ||
      hostname.endsWith(".localhost")
    ) {
      return "PUBLIC_APP_URL must not point to a local host outside local development.";
    }

    if (hostname === "example.com" || hostname.endsWith(".example.com")) {
      return "PUBLIC_APP_URL must be replaced before preview or production.";
    }

    if (hostname === "workers.dev" || hostname.endsWith(".workers.dev")) {
      return "PUBLIC_APP_URL must be the public app origin, not a workers.dev diagnostic URL.";
    }
  }

  return null;
}

export function emailDeliveryMode(env: Env): EmailDeliveryMode {
  const config = runtimeConfig(env);
  return config.EMAIL_DELIVERY_MODE ?? (config.APP_ENV === "local" ? "store" : "send");
}

export function isLocalAppEnv(env: Env): boolean {
  return runtimeConfig(env).APP_ENV === "local";
}
