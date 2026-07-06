export const TEST_AUTH_PASSWORD = "correct horse battery staple";

const jsonHeaders = {
  "content-type": "application/json",
};

export async function createAuthenticatedInvitation({ client, email, role }) {
  return client.json("/api/invitations", {
    method: "POST",
    body: JSON.stringify({ email, role }),
    headers: jsonHeaders,
  });
}

export async function createAcceptedBootstrapUser({ client, displayName, email, role }) {
  const invitation = await createBootstrapInvitation({ client, email, role });
  const accepted = await acceptInvitation({
    client,
    displayName,
    inviteToken: invitation.inviteToken,
  });

  return { accepted, invitation };
}

function createBootstrapInvitation({ client, email, role }) {
  return client.json("/api/bootstrap/invitations", {
    method: "POST",
    body: JSON.stringify({ email, role }),
    headers: jsonHeaders,
  });
}

function acceptInvitation({ client, displayName, inviteToken, password = TEST_AUTH_PASSWORD }) {
  return client.json(`/api/invitations/${inviteToken}/accept`, {
    method: "POST",
    body: JSON.stringify({
      displayName,
      password,
    }),
    headers: jsonHeaders,
  });
}

export async function createAcceptedAuthenticatedUser({
  adminClient,
  displayName,
  email,
  memberClient,
  role,
}) {
  const invitation = await createAuthenticatedInvitation({
    client: adminClient,
    email,
    role,
  });
  const accepted = await acceptInvitation({
    client: memberClient,
    displayName,
    inviteToken: invitation.inviteToken,
  });

  return { accepted, invitation };
}
