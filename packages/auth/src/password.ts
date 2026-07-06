import { base64UrlDecode, base64UrlEncode } from "./base64-url";

export type PasswordHashOptions = {
  iterations?: number;
  saltByteLength?: number;
};

const passwordHashAlgorithm = "pbkdf2-sha256";
const defaultPasswordIterations = 210_000;
const defaultSaltByteLength = 16;
const textEncoder = new TextEncoder();

export async function hashPassword(
  password: string,
  options: PasswordHashOptions = {},
): Promise<string> {
  const iterations = options.iterations ?? defaultPasswordIterations;
  const salt: Uint8Array<ArrayBuffer> = new Uint8Array(
    options.saltByteLength ?? defaultSaltByteLength,
  );
  crypto.getRandomValues(salt);

  const digest = await derivePasswordDigest(password, salt, iterations);
  return [
    passwordHashAlgorithm,
    String(iterations),
    base64UrlEncode(salt),
    base64UrlEncode(digest),
  ].join("$");
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const parts = storedHash.split("$");
  if (parts.length !== 4) return false;

  const [algorithm, iterationsText, saltText, digestText] = parts;
  if (algorithm !== passwordHashAlgorithm) return false;

  const iterations = Number.parseInt(iterationsText ?? "", 10);
  if (!Number.isFinite(iterations) || iterations <= 0) return false;

  const salt = base64UrlDecode(saltText ?? "");
  const expectedDigest = base64UrlDecode(digestText ?? "");
  const actualDigest = await derivePasswordDigest(password, salt, iterations);

  return constantTimeEqual(actualDigest, expectedDigest);
}

async function derivePasswordDigest(
  password: string,
  salt: Uint8Array<ArrayBuffer>,
  iterations: number,
): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey("raw", textEncoder.encode(password), "PBKDF2", false, [
    "deriveBits",
  ]);

  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations,
      hash: "SHA-256",
    },
    key,
    256,
  );

  return new Uint8Array(bits);
}

function constantTimeEqual(left: Uint8Array, right: Uint8Array): boolean {
  if (left.byteLength !== right.byteLength) return false;

  let difference = 0;
  for (let index = 0; index < left.byteLength; index += 1) {
    difference |= (left[index] ?? 0) ^ (right[index] ?? 0);
  }

  return difference === 0;
}
