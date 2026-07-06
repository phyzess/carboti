export function assertPackageManifestEnvGuards(context) {
  const { assert, envExample, workerDevVarsExample } = context;

  assert(
    !envExample.includes("DEEPSEEK_API_KEY") &&
      !envExample.includes("AI_PROVIDER") &&
      !workerDevVarsExample.includes("DEEPSEEK_API_KEY") &&
      !workerDevVarsExample.includes("AI_PROVIDER"),
    "env examples must not advertise unimplemented AI provider secrets.",
  );
  assert(
    envExample.includes("EMAIL_DELIVERY_MODE=store") &&
      envExample.includes("MAIL_REPLY_TO=") &&
      envExample.includes("CARBOTI_SECRET_ENCRYPTION_KEY=") &&
      workerDevVarsExample.includes("EMAIL_DELIVERY_MODE=store") &&
      workerDevVarsExample.includes("MAIL_REPLY_TO=") &&
      workerDevVarsExample.includes("CARBOTI_SECRET_ENCRYPTION_KEY="),
    "env examples must include email delivery mode, optional reply-to, and Carboti secret encryption key configuration.",
  );
}
