import { createServer } from "node:net";

export async function findOpenPort(excluded = new Set()) {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.unref();
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        server.close(() => reject(new Error("Unable to allocate a local dev port.")));
        return;
      }

      const port = String(address.port);
      server.close(async () => {
        if (excluded.has(port)) {
          try {
            resolve(await findOpenPort(excluded));
          } catch (error) {
            reject(error);
          }
          return;
        }

        resolve(port);
      });
    });
  });
}
