import { assert, createClient, expectStatus } from "./worker-integration-http.mjs";
import { assertAuditEvent } from "./worker-integration-audit-assertions.mjs";
import { createAcceptedBootstrapUser } from "./worker-integration-auth-invitation-flow.mjs";

export async function testInvitationAssignedRolesAndViewerDenials({ env, worker }) {
  const viewerClient = createClient(worker, env);
  const { accepted: viewerAccepted } = await createAcceptedBootstrapUser({
    client: viewerClient,
    displayName: "Viewer",
    email: "viewer@example.com",
    role: "viewer",
  });

  assert(viewerAccepted.user.role === "viewer", "viewer invite creates viewer role");
  await expectStatus(
    await viewerClient.post("/api/source-files", "label,value\nNope,1\n", {
      headers: {
        "content-type": "text/plain",
        "x-filename": "viewer-denied.txt",
        "x-workspace-id": "default",
      },
    }),
    403,
  );

  await assertAuditEvent(env, {
    action: "rbac.denied",
    message: "rbac denial is audited",
    subjectId: "source_file:upload",
  });

  await expectStatus(await viewerClient.request("/api/users"), 403);

  const adminClient = createClient(worker, env);
  const { accepted: adminAccepted } = await createAcceptedBootstrapUser({
    client: adminClient,
    displayName: "Admin",
    email: "admin@example.com",
    role: "admin",
  });
  assert(adminAccepted.user.role === "admin", "admin invite creates admin role");

  return { adminAccepted, adminClient };
}
