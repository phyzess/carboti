export function createInboundEmailMessage(rawEmail) {
  const bytes = new TextEncoder().encode(rawEmail);
  return {
    from: "sender@example.com",
    headers: new Headers({
      "content-type": 'multipart/mixed; boundary="qitu-boundary"',
      from: "sender@example.com",
      subject: "Inbound source",
      to: "intake@example.com",
    }),
    raw: new ReadableStream({
      start(controller) {
        controller.enqueue(bytes);
        controller.close();
      },
    }),
    rawSize: bytes.byteLength,
    to: "intake@example.com",
    forward() {
      return Promise.resolve({ id: "forwarded" });
    },
    reply() {
      return Promise.resolve({ id: "reply" });
    },
    setReject(reason) {
      this.rejected = reason;
    },
  };
}

export function createEmailExecutionContext() {
  return {
    waitUntil() {},
    passThroughOnException() {},
  };
}
