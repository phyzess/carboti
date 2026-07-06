export function assertWebRuntimeApiGuards(context) {
  const { assert, webApiAuth, webApiClient, webApiImports, webApiSources, webTypes } = context;

  assert(
    webApiSources.includes('credentials: "include"') &&
      webApiSources.includes("x-qitu-locale") &&
      webApiSources.includes("health") &&
      webApiSources.includes("createLocalInvitation") &&
      webApiSources.includes("createInvitation") &&
      webApiSources.includes("listUsers") &&
      webApiSources.includes("listInvitations") &&
      webApiSources.includes("bootstrapLocalAdmin") &&
      webApiSources.includes("acceptInvitation") &&
      webApiSources.includes("requestPasswordReset") &&
      webApiSources.includes("confirmPasswordReset") &&
      webApiSources.includes("uploadSourceFile") &&
      webApiSources.includes("listSourceFiles") &&
      webApiSources.includes("listImportJobs") &&
      webApiSources.includes("listImportJobEvents") &&
      webApiSources.includes("drainLocalImportJobs") &&
      webApiSources.includes("listAuditEvents") &&
      webApiSources.includes("getImportJobReview") &&
      webApiSources.includes("listAiAdvisories") &&
      webApiSources.includes("generateAiAdvisory") &&
      webApiSources.includes("confirmAiAdvisory") &&
      webApiSources.includes("dismissAiAdvisory") &&
      webApiSources.includes("approveStagedRecord") &&
      webApiSources.includes("rejectStagedRecord") &&
      webApiSources.includes("commitImportJob") &&
      webApiSources.includes("retryImportJob"),
    "web API client must wrap authenticated setup, password reset, upload, source, job, audit, review, AI advisory, decision, commit, and retry calls.",
  );
  assert(
    webApiAuth.includes('export { login, logout, me } from "./api-auth-session"') &&
      webApiAuth.includes("confirmPasswordReset") &&
      webApiAuth.includes("requestPasswordReset") &&
      webApiAuth.includes("./api-auth-password-reset") &&
      webApiAuth.includes("bootstrapLocalAdmin") &&
      webApiAuth.includes("bootstrapLocalReviewer") &&
      webApiAuth.includes("./api-auth-local-bootstrap") &&
      webApiAuth.includes('export { deleteUser, listUsers } from "./api-auth-users"') &&
      webApiAuth.includes("/api/auth/login") &&
      webApiAuth.includes("/api/auth/password-reset/request") &&
      webApiAuth.includes("/api/bootstrap/local-admin") &&
      webApiAuth.includes("/api/invitations") &&
      webApiAuth.includes("/api/users"),
    "web auth API client must keep api-auth.ts as a facade over focused endpoint-family modules.",
  );
  assert(
    webApiImports.includes('from "./api-imports-jobs"') &&
      webApiImports.includes('from "./api-imports-review"') &&
      webApiImports.includes('from "./api-imports-advisory"') &&
      webApiImports.includes('from "./api-imports-types"') &&
      webApiImports.includes("/api/import-jobs") &&
      webApiImports.includes("/api/dev/import-jobs/drain") &&
      webApiImports.includes("/review/confirm-pending") &&
      webApiImports.includes("/advisories") &&
      webApiImports.includes("decideStagedRecord"),
    "web import API client must keep api-imports.ts as a facade over job, review, advisory, and response-type modules.",
  );
  assert(
    webApiClient.includes('from "./api-client-errors"') &&
      webApiClient.includes("export class ApiRequestError") &&
      webApiClient.includes("apiErrorFromResponse") &&
      webApiClient.includes("Worker connection"),
    "web API client must keep transport wiring separate from structured error normalization.",
  );
  assert(
    webTypes.includes('from "./types-auth"') &&
      webTypes.includes('from "./types-source"') &&
      webTypes.includes("role: string"),
    "web API response types must keep types.ts as a facade over focused type modules.",
  );
  assert(
    webApiSources.includes("confirmPendingStagedRecords") &&
      webApiSources.includes("/review/confirm-pending"),
    "web API client must expose the backend confirm-pending route.",
  );
}
