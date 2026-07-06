import type { AppContext } from "./http-utils";

export type RequestFingerprint = {
  requestId: string | null;
  ipHash: string | null;
  userAgentHash: string | null;
};

export async function requestFingerprint(context: AppContext): Promise<RequestFingerprint> {
  const requestId = context.req.header("cf-ray") ?? context.req.header("x-request-id") ?? null;
  const ip =
    context.req.header("cf-connecting-ip") ?? context.req.header("x-forwarded-for") ?? null;
  const userAgent = context.req.header("user-agent") ?? null;

  return {
    requestId,
    ipHash: await hashEventValue(ip),
    userAgentHash: await hashEventValue(userAgent),
  };
}

export async function hashEventValue(value: string | null | undefined): Promise<string | null> {
  if (!value) {
    return null;
  }

  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}
