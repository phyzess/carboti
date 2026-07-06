export function assertPackageAppContractGuards(context) {
  const {
    assert,
    exists,
    i18nPackage,
    text,
    webSources,
    workerInboundEmail,
    workerMimeParser,
    workerMimeSources,
    workerSourceIntake,
    workerSourceIntakeStore,
    workerSources,
  } = context;

  assert(
    exists("apps/worker/src/rbac-policy.ts") &&
      exists("apps/web/src/rbac-policy.ts") &&
      text("apps/worker/src/rbac-policy.ts").includes("createRbacPolicy") &&
      text("apps/web/src/rbac-policy.ts").includes("createRbacPolicy") &&
      workerSources.includes("appCan(") &&
      webSources.includes("appCan("),
    "worker and web apps must use app-owned RBAC policy adapters instead of binding directly to package defaults.",
  );
  assert(
    workerSourceIntake.includes("createSourceFileImportJob") &&
      workerSourceIntakeStore.includes("source_file.uploaded") &&
      workerSourceIntakeStore.includes("import_job.queued") &&
      workerInboundEmail.includes("handleInboundEmail") &&
      workerInboundEmail.includes("raw-emails/") &&
      workerInboundEmail.includes("parseMimeAttachments") &&
      workerInboundEmail.includes("system:inbound-email") &&
      workerMimeParser.includes("export function parseMimeAttachments") &&
      workerMimeSources.includes("decodeHeaderValue") &&
      workerMimeSources.includes("decodeTransferEncodedBody") &&
      workerSources.includes("async email(message, env)"),
    "worker must support business-neutral inbound email intake into raw R2, source files, and import jobs.",
  );
  assert(
    webSources.includes("VITE_QITU_DEFAULT_LOCALE") &&
      webSources.includes("qitu.locale") &&
      !i18nPackage.includes("VITE_QITU_DEFAULT_LOCALE"),
    "default web locale must be app-owned configuration, not a reusable i18n package policy.",
  );
}
