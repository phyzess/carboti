import process from "node:process";
import { completeReviewerAuthFlow } from "./browser-smoke-auth-flow.mjs";
import { createBrowserSmokeFixture } from "./browser-smoke-fixture.mjs";
import {
  assertEmptyIntakeListLayout,
  assertProductionLoginHygiene,
} from "./browser-smoke-preflight.mjs";
import { runAdminMemberJourney } from "./browser-smoke-admin-flow.mjs";
import { runImportDiagnosticsJourney } from "./browser-smoke-review-diagnostics.mjs";
import { runPrimaryReviewJourney } from "./browser-smoke-review-primary.mjs";
import { createBrowserSmokeRuntime } from "./browser-smoke-runtime.mjs";

const root = process.cwd();
const runtime = await createBrowserSmokeRuntime(root);
const { webUrl } = runtime;

try {
  await runtime.waitForReady();
  await runBrowserSmoke();
  console.log("Browser smoke passed.");
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  runtime.dumpServerLog();
  process.exitCode = 1;
} finally {
  await runtime.stopServer();
  process.exit(process.exitCode ?? 0);
}

async function runBrowserSmoke() {
  const browser = await runtime.launchChromium();
  const context = await browser.newContext({
    viewport: {
      width: 1440,
      height: 960,
    },
  });
  await context.addInitScript(() => {
    window.localStorage.setItem("qitu.theme", "dark");
  });
  const page = await context.newPage();

  try {
    await assertProductionLoginHygiene({ context, webUrl });
    const emptySourceListWidth = await assertEmptyIntakeListLayout({ context, webUrl });
    const fixture = createBrowserSmokeFixture();
    const invitation = await runtime.postWorkerJson("/api/bootstrap/invitations", {
      email: fixture.email,
      role: "reviewer",
    });

    await completeReviewerAuthFlow({ page, runtime, invitation, fixture });
    await runPrimaryReviewJourney({ page, webUrl, fixture, emptySourceListWidth });
    await runImportDiagnosticsJourney({ page, webUrl, fixture });
    await runAdminMemberJourney({ page, context, runtime, webUrl, fixture });
  } finally {
    await context.close();
    await browser.close();
  }
}
