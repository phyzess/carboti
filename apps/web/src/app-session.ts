import { minimumPasswordLength } from "@carboti/auth";
import { health, me } from "./api";
import type { Translate } from "./i18n";
import type { ApiUser } from "./types";

export type AuthFormState = {
  displayName: string;
  email: string;
  password: string;
  resetToken: string;
};

export type AuthMode = "login" | "setup" | "reset";
export type LocalSetupRole = "admin" | "reviewer";

export type SessionBootstrap = {
  runtimeEnvironment: string | null;
  user: ApiUser | null;
};

export const defaultAuthForm: AuthFormState = {
  displayName: "",
  email: "",
  password: "",
  resetToken: "",
};

export const localDemoPassword = "correct horse battery staple";

export const localDemoProfiles = {
  admin: {
    displayName: "Admin",
    email: "admin@example.com",
  },
  reviewer: {
    displayName: "Operator",
    email: "reviewer@example.com",
  },
} as const satisfies Record<LocalSetupRole, { displayName: string; email: string }>;

let sessionBootstrapCache: SessionBootstrap | null = null;
let sessionBootstrapPromise: Promise<SessionBootstrap> | null = null;

export function loadSessionBootstrap(): Promise<SessionBootstrap> {
  if (sessionBootstrapCache) {
    return Promise.resolve(sessionBootstrapCache);
  }

  sessionBootstrapPromise ??= Promise.all([health().catch(() => null), me()])
    .then(([runtime, session]) => {
      const snapshot = {
        runtimeEnvironment: runtime?.environment ?? null,
        user: session.user,
      };
      sessionBootstrapCache = snapshot;
      return snapshot;
    })
    .finally(() => {
      sessionBootstrapPromise = null;
    });

  return sessionBootstrapPromise;
}

export function resetSessionBootstrap(): void {
  sessionBootstrapCache = null;
  sessionBootstrapPromise = null;
}

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Request failed.";
}

export function passwordPolicyError(password: string, t: Translate): string | null {
  return password.length < minimumPasswordLength
    ? t("auth.passwordMinLength", { count: String(minimumPasswordLength) })
    : null;
}
