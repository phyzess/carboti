import {
  firstConfiguredUrl,
  publicAppUrlValidationError,
  targets,
} from "./operator-admin-invitation-config.mjs";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class AdminInvitationUsageError extends Error {
  constructor(message) {
    super(message);
    this.name = "AdminInvitationUsageError";
  }
}

export function resolveAdminInvitationRequest(options, targetMap = targets) {
  const config = targetMap[options.target];
  if (!config) {
    throw new AdminInvitationUsageError(
      `Unknown target "${options.target}". Use local, preview, or production.`,
    );
  }

  if (!isValidAdminInvitationEmail(options.email)) {
    throw new AdminInvitationUsageError("Pass a valid --email for the first admin invitation.");
  }

  const appUrl = options.appUrl ?? firstConfiguredUrl(config) ?? config.fallbackAppUrl;
  if (!appUrl) {
    throw new AdminInvitationUsageError(
      `Missing app URL for ${options.target}. Set ${config.appUrlEnv.join(
        " or ",
      )} or pass --app-url.`,
    );
  }

  const appUrlError = publicAppUrlValidationError(appUrl, options.target);
  if (appUrlError) {
    throw new AdminInvitationUsageError(appUrlError);
  }

  return {
    appUrl,
    config,
    createdBy: options.createdBy ?? `operator:${options.target}`,
    dryRun: options.dryRun,
    email: options.email,
    expiresDays: options.expiresDays,
    target: options.target,
  };
}

export function isValidAdminInvitationEmail(value) {
  return typeof value === "string" && emailPattern.test(value);
}
