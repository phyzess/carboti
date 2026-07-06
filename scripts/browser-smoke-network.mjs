import { createServer } from "node:net";

export async function postWorkerJson(workerUrl, path, body) {
  const response = await fetch(`${workerUrl}${path}`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "content-type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`POST ${path} failed with ${response.status}`);
  }

  return response.json();
}

export async function findOpenPort() {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.unref();
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        server.close(() => reject(new Error("Unable to allocate a local Worker port.")));
        return;
      }

      const port = String(address.port);
      server.close(() => resolve(port));
    });
  });
}

export async function waitForHttp(url, timeoutMs = 45_000) {
  const startedAt = Date.now();
  let lastError = null;

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
      lastError = new Error(`${url} returned ${response.status}`);
    } catch (error) {
      lastError = error;
    }

    await delay(250);
  }

  throw new Error(
    `Timed out waiting for ${url}.${lastError ? ` Last error: ${errorMessage(lastError)}` : ""}`,
  );
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function errorMessage(error) {
  return error instanceof Error ? error.message : JSON.stringify(error);
}
