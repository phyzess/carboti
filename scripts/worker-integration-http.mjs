import { cookieHeader, storeResponseCookies } from "./worker-integration-http-cookies.mjs";

export { assert, expectApiError, expectStatus } from "./worker-integration-http-assertions.mjs";

export function createClient(worker, env) {
  const origin = "https://qitu.test";
  const jar = new Map();

  async function request(path, options = {}) {
    const headers = new Headers(options.headers);
    const cookies = cookieHeader(jar);
    if (cookies) {
      headers.set("cookie", cookies);
    }

    const response = await worker.fetch(
      new Request(new URL(path, origin), {
        ...options,
        headers,
      }),
      env,
      {
        waitUntil() {},
        passThroughOnException() {},
      },
    );

    storeResponseCookies(jar, response);
    return response;
  }

  return {
    request,
    post(path, body, options = {}) {
      return request(path, {
        ...options,
        method: "POST",
        body,
      });
    },
    async json(path, options = {}) {
      const response = await request(path, options);
      if (!response.ok) {
        throw new Error(`${options.method ?? "GET"} ${path} failed with ${response.status}`);
      }
      return response.json();
    },
  };
}
