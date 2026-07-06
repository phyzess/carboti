export class FakeR2Bucket {
  constructor() {
    this.objects = new Map();
  }

  async put(key, value, options = {}) {
    const bytes = await toUint8Array(value);
    this.objects.set(key, {
      key,
      bytes,
      size: bytes.byteLength,
      httpMetadata: options.httpMetadata,
      customMetadata: options.customMetadata,
    });
  }

  async get(key) {
    const object = this.objects.get(key);
    if (!object) {
      return null;
    }

    return {
      ...object,
      body: new ReadableStream({
        start(controller) {
          controller.enqueue(object.bytes);
          controller.close();
        },
      }),
    };
  }

  async delete(key) {
    this.objects.delete(key);
  }

  has(key) {
    return this.objects.has(key);
  }
}

async function toUint8Array(value) {
  if (value instanceof Uint8Array) {
    return value;
  }

  if (value instanceof ArrayBuffer) {
    return new Uint8Array(value);
  }

  if (typeof value === "string") {
    return new TextEncoder().encode(value);
  }

  if (value instanceof Blob) {
    return new Uint8Array(await value.arrayBuffer());
  }

  throw new Error("Unsupported R2 object body.");
}
