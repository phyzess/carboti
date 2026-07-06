import { createTestEnv } from "./worker-integration-env.mjs";
import { createClient, expectApiError } from "./worker-integration-http.mjs";

export async function testBootstrapDisabledOutsideLocal({ worker }) {
  const previewEnv = await createTestEnv({
    APP_ENV: "preview",
    PUBLIC_APP_URL: "https://preview.example.com",
  });
  const previewClient = createClient(worker, previewEnv);
  await expectApiError(
    await previewClient.request("/api/bootstrap/invitations", {
      method: "POST",
      body: JSON.stringify({
        email: "preview-bootstrap@example.com",
        role: "admin",
      }),
      headers: {
        "content-type": "application/json",
      },
    }),
    403,
    "bootstrap_disabled",
  );
  await expectApiError(
    await previewClient.request("/api/bootstrap/local-reviewer", {
      method: "POST",
      body: JSON.stringify({
        email: "preview-local-reviewer@example.com",
        password: "correct horse battery staple",
      }),
      headers: {
        "content-type": "application/json",
      },
    }),
    403,
    "bootstrap_disabled",
  );
  await expectApiError(
    await previewClient.request("/api/bootstrap/local-admin", {
      method: "POST",
      body: JSON.stringify({
        email: "preview-local-admin@example.com",
        password: "correct horse battery staple",
      }),
      headers: {
        "content-type": "application/json",
      },
    }),
    403,
    "bootstrap_disabled",
  );
}
