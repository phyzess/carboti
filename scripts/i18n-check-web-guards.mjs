const dynamicKeyPrefixes = ["role.", "status."];

const allowedUnusedKeys = new Set([
  "empty.noEvents",
  "empty.noEventsDescription",
  "error.requestFailed",
  "search.close",
]);

const forbiddenHardcodedPhrases = [
  "Accept invitation",
  "Reset password",
  "Operator access",
  "Source files",
  "Process local queue",
  "Commit confirmed",
  "Members and invitations",
  "Audit timeline",
  "AI advisory",
  "Confirmation console",
  "Staged records",
  "Event stream",
  "Upload selected",
  "Exclude record",
  "Confirm record",
  "Retry job",
];

const splitDictionaryFiles = [
  "apps/web/src/i18n/messages-en-core.ts",
  "apps/web/src/i18n/messages-en-auth.ts",
  "apps/web/src/i18n/messages-en-workflow.ts",
  "apps/web/src/i18n/messages-en-review.ts",
  "apps/web/src/i18n/messages-zh-cn-core.ts",
  "apps/web/src/i18n/messages-zh-cn-auth.ts",
  "apps/web/src/i18n/messages-zh-cn-workflow.ts",
  "apps/web/src/i18n/messages-zh-cn-review.ts",
];

export function assertWebI18nCoverage(context) {
  assertDictionaryParity(context);
  assertWebDictionaryUsage(context);
  assertNoHardcodedWebCopy(context);
  assertWebI18nSurface(context);
}

function assertDictionaryParity({ assert, enKeys, enKeySet, zhKeys, zhKeySet }) {
  for (const key of enKeys) {
    assert(zhKeySet.has(key), `zh-CN dictionary is missing key: ${key}`);
  }

  for (const key of zhKeys) {
    assert(enKeySet.has(key), `zh-CN dictionary includes unknown key: ${key}`);
  }
}

function assertWebDictionaryUsage({ assert, enKeys, webRuntimeSource }) {
  for (const key of enKeys) {
    if (dynamicKeyPrefixes.some((prefix) => key.startsWith(prefix))) continue;
    if (allowedUnusedKeys.has(key)) continue;

    assert(
      webRuntimeSource.includes(`"${key}"`),
      `web message key is not used outside message files: ${key}`,
    );
  }
}

function assertNoHardcodedWebCopy({ assert, webRuntimeSource }) {
  for (const phrase of forbiddenHardcodedPhrases) {
    assert(
      !webRuntimeSource.includes(phrase),
      `visible English UI copy must come from the web dictionary, found hard-coded phrase: ${phrase}`,
    );
  }
}

function assertWebI18nSurface({ assert, exists, webRuntimeSource }) {
  assert(exists("apps/web/src/i18n/provider.tsx"), "web i18n provider must be split.");
  assert(exists("apps/web/src/i18n/runtime.ts"), "web i18n runtime helpers must be split.");
  assert(exists("apps/web/src/i18n/locales.ts"), "web i18n locales must be split.");
  assert(exists("apps/web/src/i18n/messages.ts"), "web i18n facade must exist.");
  assert(
    exists("apps/web/src/i18n/messages-en.ts") &&
      exists("apps/web/src/i18n/messages-zh-cn.ts") &&
      exists("apps/web/src/i18n/message-types.ts"),
    "web i18n dictionaries and message key types must be split.",
  );
  assert(
    splitDictionaryFiles.every((path) => exists(path)),
    "web i18n app copy must live in split shell/auth/workflow/review dictionary modules.",
  );
  assert(
    webRuntimeSource.includes("createI18nRuntime") &&
      webRuntimeSource.includes("persistLocale") &&
      webRuntimeSource.includes("readStoredLocale") &&
      webRuntimeSource.includes("createCodeLabeler"),
    "web i18n provider must keep React context separate from app runtime formatter and persistence helpers.",
  );
  assert(
    webRuntimeSource.includes("function LanguageSelector") &&
      webRuntimeSource.includes("MenuRadioGroup") &&
      webRuntimeSource.includes("MenuRadioItem") &&
      webRuntimeSource.includes("localeOptions.map") &&
      !webRuntimeSource.includes("cycleLocale"),
    "web language control must present explicit locale choices instead of one-click cycling.",
  );
  assert(
    webRuntimeSource.includes("x-qitu-locale"),
    "web API client must send the current locale to the Worker.",
  );
}
