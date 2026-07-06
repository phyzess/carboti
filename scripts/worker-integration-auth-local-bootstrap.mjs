import { assert, createClient } from "./worker-integration-http.mjs";

export async function testLocalBootstrapAccounts({ env, worker }) {
  const demoClient = createClient(worker, env);
  const demoReviewer = await demoClient.json("/api/bootstrap/local-reviewer", {
    method: "POST",
    body: JSON.stringify({
      email: "local-demo@example.com",
      displayName: "Local Demo",
      password: "correct horse battery staple",
    }),
    headers: {
      "content-type": "application/json",
    },
  });

  assert(demoReviewer.created === true, "local demo reviewer bootstrap creates a user");
  assert(demoReviewer.user.role === "reviewer", "local demo reviewer uses reviewer role");

  const demoAdminClient = createClient(worker, env);
  const demoAdmin = await demoAdminClient.json("/api/bootstrap/local-admin", {
    method: "POST",
    body: JSON.stringify({
      email: "local-admin@example.com",
      displayName: "Local Admin",
      password: "correct horse battery staple",
    }),
    headers: {
      "content-type": "application/json",
    },
  });

  assert(demoAdmin.created === true, "local demo admin bootstrap creates a user");
  assert(demoAdmin.user.role === "admin", "local demo admin uses admin role");
  const demoAdminUsers = await demoAdminClient.json("/api/users?limit=20");
  assert(
    demoAdminUsers.users.some((user) => user.email === "local-admin@example.com"),
    "local demo admin can list users",
  );

  await demoClient.json("/api/auth/logout", {
    method: "POST",
  });

  const demoLogin = await demoClient.json("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: "local-demo@example.com",
      password: "correct horse battery staple",
    }),
    headers: {
      "content-type": "application/json",
    },
  });

  assert(demoLogin.user.email === "local-demo@example.com", "local demo credentials log in");
}
