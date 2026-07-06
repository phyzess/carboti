import process from "node:process";

import { assertAuthAndDbInterfaces } from "./package-interface-auth-db-guards.mjs";
import { assertCoreInterfaces } from "./package-interface-core-guards.mjs";
import { assertEmailInterfaces } from "./package-interface-email-guards.mjs";
import { assertExampleFeatureInterfaces } from "./package-interface-example-guards.mjs";
import { assertI18nAndRbacInterfaces } from "./package-interface-i18n-rbac-guards.mjs";
import { assertImportPipelineInterfaces } from "./package-interface-import-guards.mjs";
import { createPackageInterfaceRuntime } from "./package-interface-runtime.mjs";
import { assertTemplateAndWebApiInterfaces } from "./package-interface-template-web-guards.mjs";

const failures = [];

function assert(condition, message) {
  if (!condition) failures.push(message);
}

const runtime = await createPackageInterfaceRuntime({ root: process.cwd() });

try {
  const context = { assert, ...runtime.modules };
  assertAuthAndDbInterfaces(context);
  assertCoreInterfaces(context);
  assertEmailInterfaces(context);
  await assertExampleFeatureInterfaces(context);
  assertImportPipelineInterfaces(context);
  assertI18nAndRbacInterfaces(context);
  await assertTemplateAndWebApiInterfaces(context);
} finally {
  await runtime.server.close();
}

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`package interface: ${failure}`);
  }
  console.error(`Package interface tests failed with ${failures.length} failure(s).`);
  process.exit(1);
}

console.log("Package interface tests passed.");
