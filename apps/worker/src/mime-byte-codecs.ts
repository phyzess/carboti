export function base64ToBytes(value: string): Uint8Array {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

export function textToBytes(value: string): Uint8Array {
  return new TextEncoder().encode(value);
}

export function quotedPrintableBodyToBytes(value: string): Uint8Array {
  const bytes: number[] = [];
  const encoder = new TextEncoder();

  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];
    const hex = value.slice(index + 1, index + 3);
    if (character === "=" && /^[\da-fA-F]{2}$/.test(hex)) {
      bytes.push(Number.parseInt(hex, 16));
      index += 2;
      continue;
    }

    bytes.push(...encoder.encode(character));
  }

  return new Uint8Array(bytes);
}

export function percentEncodedBytes(value: string): Uint8Array {
  const bytes: number[] = [];
  const encoder = new TextEncoder();

  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];
    const hex = value.slice(index + 1, index + 3);
    if (character === "%" && /^[\da-fA-F]{2}$/.test(hex)) {
      bytes.push(Number.parseInt(hex, 16));
      index += 2;
      continue;
    }

    bytes.push(...encoder.encode(character));
  }

  return new Uint8Array(bytes);
}
