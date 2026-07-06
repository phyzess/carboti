const textEncoder = new TextEncoder();

export async function createAdminInvitation(input) {
  const now = new Date();
  const expiresAt = new Date(now);
  expiresAt.setDate(expiresAt.getDate() + input.expiresDays);
  const token = generateToken();
  const id = crypto.randomUUID();
  const email = normalizeEmail(input.email);

  return {
    auditEventId: crypto.randomUUID(),
    createdAt: now.toISOString(),
    createdBy: input.createdBy,
    email,
    expiresAt: expiresAt.toISOString(),
    id,
    inviteUrl: buildInviteUrl(input.appUrl, token),
    role: "admin",
    status: "pending",
    tokenHash: await hashSecret(token),
  };
}

function generateToken(byteLength = 32) {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return base64UrlEncode(bytes);
}

async function hashSecret(secret) {
  const digest = await crypto.subtle.digest("SHA-256", textEncoder.encode(secret));
  return `sha256.${base64UrlEncode(new Uint8Array(digest))}`;
}

function base64UrlEncode(bytes) {
  return Buffer.from(bytes)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function buildInviteUrl(appUrl, token) {
  const url = new URL(appUrl);
  url.pathname = `/invite/${token}`;
  url.search = "";
  url.hash = "";
  return url.toString();
}
