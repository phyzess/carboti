export async function assertSdkInterfaces({ assert, cli, sdk }) {
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

  await client.createApiClient({
    name: "Internal integration",
    scopes: ["ingest:write"],
  });
  await client.listApiClients();
  await client.revokeApiClient("api-client:example");
  await client.createSecret({
    kind: "connector_credential",
    name: "Connector credential",
    plaintext: "secret-value",
  });
  await client.listSecrets();
  await client.revokeSecret("secret:connector_credential:example");
  await client.listConnectorManifests();
  await client.registerConnectorSource({
    config: {
      bucket: "incoming",
    },
    kind: "r2",
    name: "Incoming R2",
    secretRefs: {
      credential: "secret:connector_credential:example",
    },
  });
  await client.ingestConnectorObject("source:r2:example", {
    contentText: "hello",
    contentType: "text/plain",
    filename: "hello.txt",
  });
  await client.getMessageTrace("message-1");
  await client.createArtifactDownloadUrl("artifact-1", {
    ttlSeconds: 60,
  });
  await client.createHostedProcessor({
    name: "Hosted processor",
    resourceLimits: {
      timeoutSeconds: 30,
    },
    runtime: "cloudflare_workers",
  });

  assert(
    requests[1]?.url === "https://carboti.example.test/api/carboti/api-clients" &&
      requests[1]?.init?.method === "POST" &&
      requests[4]?.url === "https://carboti.example.test/api/carboti/secrets" &&
      requests[4]?.init?.method === "POST" &&
      requests[7]?.url === "https://carboti.example.test/api/carboti/connectors/manifests" &&
      requests[7]?.init?.method === "GET" &&
      requests[8]?.url === "https://carboti.example.test/api/carboti/connectors/sources" &&
      requests[8]?.init?.method === "POST" &&
      requests[9]?.url ===
        "https://carboti.example.test/api/carboti/connectors/sources/source%3Ar2%3Aexample/ingest" &&
      requests[9]?.init?.method === "POST" &&
      requests[10]?.url === "https://carboti.example.test/api/carboti/messages/message-1/trace" &&
      requests[11]?.url ===
        "https://carboti.example.test/api/carboti/artifacts/artifact-1/download-url" &&
      requests[11]?.init?.method === "POST" &&
      requests[12]?.url === "https://carboti.example.test/api/carboti/processors/hosted" &&
      requests[12]?.init?.method === "POST",
    "sdk must expose API client, secret, connector, trace, download, and hosted processor helpers.",
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

  const output = [];
  const errors = [];
  const initExitCode = await cli.runCarbotiCli(
    ["init", "--base-url", "https://carboti.example.test"],
    {},
    {
      stderr: {
        write: (value) => errors.push(value),
      },
      stdin: ReadableStream.from([]),
      stdout: {
        write: (value) => output.push(value),
      },
    },
  );

  assert(
    initExitCode === 0 &&
      errors.length === 0 &&
      output.join("").includes("https://carboti.example.test"),
    "cli must expose an init command that prints a local configuration template.",
  );
}
