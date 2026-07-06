export type ApiErrorIssue = {
  message: string;
  path?: string;
};

export class ApiRequestError extends Error {
  code: string | null;
  issues: ApiErrorIssue[];
  status: number;

  constructor(input: {
    code?: string | null;
    issues?: ApiErrorIssue[];
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

export async function apiErrorFromResponse(response: Response): Promise<ApiRequestError> {
  const fallback = `Request failed with ${response.status}`;
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    return new ApiRequestError({
      message: fallback,
      status: response.status,
    });
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    return new ApiRequestError({
      message: fallback,
      status: response.status,
    });
  }

  const error = isRecord(body) && isRecord(body.error) ? body.error : null;
  const message = typeof error?.message === "string" ? error.message : fallback;
  const code = typeof error?.code === "string" ? error.code : null;
  const issues = Array.isArray(error?.issues)
    ? error.issues.flatMap((issue): ApiErrorIssue[] => {
        if (!isRecord(issue) || typeof issue.message !== "string") {
          return [];
        }

        return [
          {
            message: issue.message,
            ...(typeof issue.path === "string" ? { path: issue.path } : {}),
          },
        ];
      })
    : [];

  return new ApiRequestError({
    code,
    issues,
    message,
    status: response.status,
  });
}

export function apiNetworkError(): ApiRequestError {
  return new ApiRequestError({
    message: "Network request failed. Check the Worker connection and try again.",
    status: 0,
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
