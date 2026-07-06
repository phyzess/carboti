export function assertPackageCoreContractGuards(context) {
  const { aiAdvisoryPackage, assert, authPackage, emailPackage, exists, i18nPackage, rbacPackage } =
    context;

  assert(
    aiAdvisoryPackage.includes("AdvisoryArtifactSchema") &&
      aiAdvisoryPackage.includes("GenerateImportReviewAdvisoryInputSchema") &&
      aiAdvisoryPackage.includes("generateLocalImportReviewAdvisory") &&
      aiAdvisoryPackage.includes("requiresHumanConfirmation"),
    "AI advisory package must expose schemas, local generator, and human confirmation guard.",
  );
  assert(
    exists("packages/auth/src/schemas.ts") &&
      exists("packages/auth/src/password.ts") &&
      exists("packages/auth/src/tokens.ts") &&
      exists("packages/auth/src/factories.ts") &&
      authPackage.includes("hashPassword"),
    "auth package must expose password hashing from focused support modules.",
  );
  assert(authPackage.includes("createSession"), "auth package must expose session creation.");
  assert(authPackage.includes("role: v.string()"), "auth user schema must include a role.");
  assert(
    authPackage.includes("RequestPasswordResetInputSchema") &&
      authPackage.includes("ConfirmPasswordResetInputSchema") &&
      authPackage.includes("createPasswordResetToken"),
    "auth package must expose password reset schemas and token creation.",
  );
  assert(
    exists("packages/rbac/src/types.ts") &&
      exists("packages/rbac/src/policy.ts") &&
      exists("packages/rbac/src/starter-policy.ts") &&
      exists("packages/rbac/src/permission-checks.ts") &&
      rbacPackage.includes("createRbacPolicy") &&
      rbacPackage.includes("starterRolePolicy") &&
      rbacPackage.includes('roleNames = ["owner", "admin", "reviewer", "viewer"]') &&
      rbacPackage.includes("rolePermissions") &&
      rbacPackage.includes("viewer: []") &&
      rbacPackage.includes("normalizeRoleForPolicy") &&
      rbacPackage.includes('"invitation:create"') &&
      rbacPackage.includes('"source_file:upload"'),
    "rbac package must expose a default starter policy plus app-owned role policy helpers.",
  );
  assert(
    emailPackage.includes("EmailMessageSchema") &&
      emailPackage.includes("InboundEmailReceiptSchema") &&
      emailPackage.includes("InboundEmailAttachmentSchema") &&
      emailPackage.includes("renderInvitationEmail") &&
      emailPackage.includes("renderPasswordResetEmail") &&
      emailPackage.includes("locale?: string") &&
      emailPackage.includes("zhCnAuthEmailMessages"),
    "email package must expose localized auth email templates and inbound email receipt schemas.",
  );
  assert(
    i18nPackage.includes("createTranslator") &&
      i18nPackage.includes("Intl.PluralRules") &&
      i18nPackage.includes("Intl.RelativeTimeFormat") &&
      i18nPackage.includes("localeCandidatesFromAcceptLanguage") &&
      i18nPackage.includes("resolveLocale") &&
      exists("packages/i18n/src/formatters.ts") &&
      exists("packages/i18n/src/locale.ts"),
    "i18n package must expose reusable translator, plural, relative-time, and locale negotiation helpers from focused modules.",
  );
}
