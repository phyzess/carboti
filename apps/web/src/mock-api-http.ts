export type RequestOptions = Omit<RequestInit, "credentials">;

export type MockApiIssue = {
  message: string;
  path?: string;
};

export class MockApiRequestError extends Error {
  code: string | null;
  issues: MockApiIssue[];
  status: number;

  constructor(input: {
    code?: string | null;
    issues?: MockApiIssue[];
    message: string;
    status: number;
  }) {
    super(input.message);
    this.name = "ApiRequestError";
    this.code = input.code ?? null;
    this.issues = input.issues ?? [];
    this.status = input.status;
  }
}

export async function readJsonBody<T>(options: RequestOptions): Promise<T> {
  const body = options.body;
  if (!body) return {} as T;
  if (typeof body === "string") return JSON.parse(body) as T;
  if (body instanceof Blob) return JSON.parse(await body.text()) as T;
  if (body instanceof URLSearchParams) {
    return Object.fromEntries(body.entries()) as T;
  }
  return {} as T;
}

export async function bodyText(body: BodyInit | null | undefined): Promise<string> {
  if (!body) return "";
  if (typeof body === "string") return body;
  if (body instanceof Blob) return body.text();
  if (body instanceof URLSearchParams) return body.toString();
  return "";
}

export function bodySize(body: BodyInit | null | undefined, text: string): number {
  if (body instanceof Blob) return body.size;
  return new TextEncoder().encode(text).byteLength;
}

export function limited<T>(items: T[], url: URL): T[] {
  const limit = Number.parseInt(url.searchParams.get("limit") ?? "", 10);
  return items.slice(0, Number.isFinite(limit) && limit > 0 ? limit : items.length);
}

export function respond<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function requestError(status: number, code: string, message: string): MockApiRequestError {
  return new MockApiRequestError({
    code,
    message,
    status,
  });
}
