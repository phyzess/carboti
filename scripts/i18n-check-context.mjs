import { createProjectReader } from "./i18n-check-io.mjs";
import { extractMessageKeysFromSources } from "./i18n-check-message-keys.mjs";

const webI18nFacadeFiles = [
  "apps/web/src/i18n/message-types.ts",
  "apps/web/src/i18n/messages.ts",
  "apps/web/src/i18n/messages-en.ts",
  "apps/web/src/i18n/messages-zh-cn.ts",
];

const webEnMessageFiles = [
  "apps/web/src/i18n/messages-en-core.ts",
  "apps/web/src/i18n/messages-en-auth.ts",
  "apps/web/src/i18n/messages-en-workflow.ts",
  "apps/web/src/i18n/messages-en-review.ts",
];

const webZhMessageFiles = [
  "apps/web/src/i18n/messages-zh-cn-core.ts",
  "apps/web/src/i18n/messages-zh-cn-auth.ts",
  "apps/web/src/i18n/messages-zh-cn-workflow.ts",
  "apps/web/src/i18n/messages-zh-cn-review.ts",
];

const webMessageFiles = new Set([
  ...webI18nFacadeFiles,
  ...webEnMessageFiles,
  ...webZhMessageFiles,
]);

const workerAuthLocaleFiles = [
  "apps/worker/src/auth-bootstrap-routes.ts",
  "apps/worker/src/auth-invitation-create-route.ts",
  "apps/worker/src/auth-invitation-response.ts",
  "apps/worker/src/auth-invitation-resend-route.ts",
  "apps/worker/src/auth-invitation-routes.ts",
  "apps/worker/src/auth-local-bootstrap.ts",
  "apps/worker/src/auth-password-routes.ts",
  "apps/worker/src/auth-password-reset-request-route.ts",
  "apps/worker/src/auth-password-reset-confirm-route.ts",
  "apps/worker/src/auth-route-support.ts",
];

export function createI18nCheckContext({ root }) {
  const reader = createProjectReader(root);
  const webEnMessages = webEnMessageFiles.map((path) => reader.text(path));
  const webZhMessages = webZhMessageFiles.map((path) => reader.text(path));
  const webRuntimeFiles = reader.collectSourceFiles("apps/web/src", (path) => {
    return /\.(ts|tsx)$/.test(path) && !webMessageFiles.has(path);
  });
  const enKeys = extractMessageKeysFromSources(webEnMessages);
  const zhKeys = extractMessageKeysFromSources(webZhMessages);

  return {
    ...reader,
    appTemplateManifest: JSON.parse(reader.text("templates/app/manifest.json")),
    enKeys,
    enKeySet: new Set(enKeys),
    packageI18n: reader
      .collectSourceFiles("packages/i18n/src", (path) => path.endsWith(".ts"))
      .map((path) => reader.text(path))
      .join("\n"),
    packageJson: JSON.parse(reader.text("package.json")),
    webRuntimeFiles,
    webRuntimeSource: webRuntimeFiles.map((path) => reader.text(path)).join("\n"),
    workerAuthLocaleSource: workerAuthLocaleFiles.map((path) => reader.text(path)).join("\n"),
    zhKeys,
    zhKeySet: new Set(zhKeys),
  };
}
