export type CarbotiEncryptedSecret = {
  algorithm: "AES-GCM-256";
  ciphertext: string;
  iv: string;
  keyVersion: "v1";
};

const algorithm = "AES-GCM-256" as const;
const keyVersion = "v1" as const;

export async function encryptCarbotiSecret(
  env: Env,
  plaintext: string,
): Promise<CarbotiEncryptedSecret> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await importRootKey(env);
  const ciphertext = await crypto.subtle.encrypt(
    {
      iv,
      name: "AES-GCM",
    },
    key,
    new TextEncoder().encode(plaintext),
  );

  return {
    algorithm,
    ciphertext: encodeBase64Url(new Uint8Array(ciphertext)),
    iv: encodeBase64Url(iv),
    keyVersion,
  };
}

export async function decryptCarbotiSecret(
  env: Env,
  encrypted: CarbotiEncryptedSecret,
): Promise<string> {
  if (encrypted.algorithm !== algorithm || encrypted.keyVersion !== keyVersion) {
    throw new Error("Unsupported Carboti secret encryption metadata.");
  }

  const key = await importRootKey(env);
  const plaintext = await crypto.subtle.decrypt(
    {
      iv: decodeBase64Url(encrypted.iv),
      name: "AES-GCM",
    },
    key,
    decodeBase64Url(encrypted.ciphertext),
  );
  return new TextDecoder().decode(plaintext);
}

async function importRootKey(env: Env): Promise<CryptoKey> {
  const keyMaterial = env.CARBOTI_SECRET_ENCRYPTION_KEY;
  if (!keyMaterial || keyMaterial.length < 32) {
    throw new Error("CARBOTI_SECRET_ENCRYPTION_KEY must be at least 32 characters.");
  }

  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(keyMaterial));
  return crypto.subtle.importKey("raw", digest, "AES-GCM", false, ["encrypt", "decrypt"]);
}

function encodeBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function decodeBase64Url(value: string): ArrayBuffer {
  const padded = value
    .replaceAll("-", "+")
    .replaceAll("_", "/")
    .padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  const buffer = new ArrayBuffer(binary.length);
  const bytes = new Uint8Array(buffer);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return buffer;
}
