import { exports } from "cloudflare:workers";
import { describe, expect, it } from "vitest";

describe("worker runtime", () => {
  it("responds to health checks inside the Workers runtime", async () => {
    const response = await exports.default.fetch("https://qitu.test/health");

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      ok: true,
      service: "carboti-worker",
      environment: "local",
    });
  });

  it("rejects unauthenticated source uploads before touching bindings", async () => {
    const response = await exports.default.fetch("https://qitu.test/api/source-files", {
      body: "label,value\nUnauthorized,1\n",
      headers: {
        "content-type": "text/plain",
        "x-filename": "unauthorized.txt",
        "x-workspace-id": "default",
      },
      method: "POST",
    });

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toMatchObject({
      error: {
        code: "unauthorized",
      },
    });
  });
});
