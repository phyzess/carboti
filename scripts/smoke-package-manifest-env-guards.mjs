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
      workerDevVarsExample.includes("EMAIL_DELIVERY_MODE=store") &&
      workerDevVarsExample.includes("MAIL_REPLY_TO="),
    "env examples must include email delivery mode and optional reply-to configuration.",
  );
}
