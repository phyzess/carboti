export async function assertSdkInterfaces({ assert, sdk }) {
  assert(
    sdk.CarbotiClient && sdk.CarbotiApiError,
    "sdk must export CarbotiClient and CarbotiApiError.",
  );

  const requests = [];
  const client = new sdk.CarbotiClient({
    baseUrl: "https://carboti.example.test",
    fetch: async (url, init) => {
      requests.push({ init, url });
      return Response.json({
        ok: true,
      });
    },
    token: "sdk-token",
  });

  await client.ingestHttp({
    body: "label,value\nExternal,42\n",
    contentType: "text/plain",
    filename: "external-ledger.txt",
  });

  assert(
    requests[0]?.url === "https://carboti.example.test/api/carboti/ingest/http" &&
      requests[0]?.init?.method === "POST" &&
      requests[0]?.init?.headers instanceof Headers &&
      requests[0].init.headers.get("authorization") === "Bearer sdk-token" &&
      requests[0].init.headers.get("x-carboti-filename") === "external-ledger.txt",
    "sdk must send authenticated HTTP ingest requests with Carboti headers.",
  );

  const failingClient = new sdk.CarbotiClient({
    baseUrl: "https://carboti.example.test",
    fetch: async () =>
      Response.json(
        {
          code: "missing_api_token",
          message: "Missing API token.",
        },
        {
          status: 401,
        },
      ),
  });

  try {
    await failingClient.getObject("object-1");
    assert(false, "sdk must throw CarbotiApiError for non-2xx responses.");
  } catch (error) {
    assert(
      error instanceof sdk.CarbotiApiError &&
        error.status === 401 &&
        error.code === "missing_api_token",
      "sdk error must expose API status and code.",
    );
  }
}
