export function assertWorkerI18nLocale({ assert, text, workerAuthLocaleSource }) {
  assert(
    text("apps/worker/src/locale.ts").includes("localeFromRequest") &&
      workerAuthLocaleSource.includes("localeFromRequest") &&
      workerAuthLocaleSource.includes("sendInvitationEmail") &&
      workerAuthLocaleSource.includes("sendPasswordResetEmail") &&
      text("packages/email/src/auth-email-rendering.ts").includes("locale?: string"),
    "Worker auth email paths must derive locale and pass it into email rendering.",
  );
}
