import type {
  CarbotiArtifactKind,
  CarbotiOpenApiDocument,
  CarbotiProcessorCapabilityManifest,
} from "@carboti/core";

export type CarbotiClientOptions = {
  baseUrl: string;
  fetch?: typeof fetch;
  token?: string;
};

export type CarbotiRequestOptions = {
  body?: BodyInit | undefined;
  headers?: HeadersInit | undefined;
  json?: unknown;
  method?: string | undefined;
  token?: string | undefined;
};

export type CarbotiHttpIngestInput = {
  body: BodyInit;
  contentType?: string | undefined;
  filename?: string | undefined;
  token?: string | undefined;
};

export type CarbotiArtifactSubmitInput = {
  contentType?: string | undefined;
  data: unknown;
  kind: CarbotiArtifactKind;
  schemaId?: string | undefined;
  token?: string | undefined;
};

export type CarbotiExternalProcessorInput = {
  capabilityManifest?: CarbotiProcessorCapabilityManifest | undefined;
  endpointUrl: string;
  name: string;
  signingSecret: string;
  timeoutSeconds?: number | undefined;
  token?: string | undefined;
};

export type CarbotiInvokeProcessorInput = {
  messageId: string;
  token?: string | undefined;
};

export type CarbotiContract = {
  kinds: Record<string, readonly string[]>;
  service: "carboti";
  tagline: string;
  version: string;
};

export type CarbotiApiResponse = Record<string, unknown>;

export class CarbotiApiError extends Error {
  readonly body: unknown;
  readonly code: string;
  readonly status: number;

  constructor(input: { body: unknown; code: string; message: string; status: number }) {
    super(input.message);
    this.name = "CarbotiApiError";
    this.body = input.body;
    this.code = input.code;
    this.status = input.status;
  }
}

export class CarbotiClient {
  private readonly baseUrl: string;
  private readonly fetchFn: typeof fetch;
  private readonly token: string | undefined;

  constructor(options: CarbotiClientOptions) {
    this.baseUrl = normalizeBaseUrl(options.baseUrl);
    this.fetchFn = options.fetch ?? fetch;
    this.token = options.token;
  }

  getContract(input: { token?: string | undefined } = {}): Promise<CarbotiContract> {
    return this.requestJson("/api/carboti/contract", {
      token: input.token,
    });
  }

  getOpenApi(input: { token?: string | undefined } = {}): Promise<CarbotiOpenApiDocument> {
    return this.requestJson("/api/carboti/openapi.json", {
      token: input.token,
    });
  }

  ingestHttp(input: CarbotiHttpIngestInput): Promise<CarbotiApiResponse> {
    const headers = new Headers();
    if (input.contentType) headers.set("content-type", input.contentType);
    if (input.filename) headers.set("x-carboti-filename", input.filename);

    return this.requestJson("/api/carboti/ingest/http", {
      body: input.body,
      headers,
      method: "POST",
      token: input.token,
    });
  }

  getObject(
    objectId: string,
    input: { token?: string | undefined } = {},
  ): Promise<CarbotiApiResponse> {
    return this.requestJson(`/api/carboti/objects/${encodePathSegment(objectId)}`, {
      token: input.token,
    });
  }

  getArtifact(
    artifactId: string,
    input: { token?: string | undefined } = {},
  ): Promise<CarbotiApiResponse> {
    return this.requestJson(`/api/carboti/artifacts/${encodePathSegment(artifactId)}`, {
      token: input.token,
    });
  }

  listMessageArtifacts(
    messageId: string,
    input: { token?: string | undefined } = {},
  ): Promise<CarbotiApiResponse> {
    return this.requestJson(`/api/carboti/messages/${encodePathSegment(messageId)}/artifacts`, {
      token: input.token,
    });
  }

  getMessageLineage(
    messageId: string,
    input: { token?: string | undefined } = {},
  ): Promise<CarbotiApiResponse> {
    return this.requestJson(`/api/carboti/messages/${encodePathSegment(messageId)}/lineage`, {
      token: input.token,
    });
  }

  replayMessage(
    messageId: string,
    input: { token?: string | undefined } = {},
  ): Promise<CarbotiApiResponse> {
    return this.requestJson(`/api/carboti/messages/${encodePathSegment(messageId)}/replay`, {
      method: "POST",
      token: input.token,
    });
  }

  submitMessageArtifact(
    messageId: string,
    input: CarbotiArtifactSubmitInput,
  ): Promise<CarbotiApiResponse> {
    return this.requestJson(`/api/carboti/messages/${encodePathSegment(messageId)}/artifacts`, {
      json: {
        contentType: input.contentType,
        data: input.data,
        kind: input.kind,
        schemaId: input.schemaId,
      },
      method: "POST",
      token: input.token,
    });
  }

  createExternalProcessor(input: CarbotiExternalProcessorInput): Promise<CarbotiApiResponse> {
    return this.requestJson("/api/carboti/processors/external", {
      json: {
        capabilityManifest: input.capabilityManifest,
        endpointUrl: input.endpointUrl,
        name: input.name,
        signingSecret: input.signingSecret,
        timeoutSeconds: input.timeoutSeconds,
      },
      method: "POST",
      token: input.token,
    });
  }

  invokeProcessor(
    processorId: string,
    input: CarbotiInvokeProcessorInput,
  ): Promise<CarbotiApiResponse> {
    return this.requestJson(`/api/carboti/processors/${encodePathSegment(processorId)}/invoke`, {
      json: {
        messageId: input.messageId,
      },
      method: "POST",
      token: input.token,
    });
  }

  retryProcessorDelivery(
    deliveryId: string,
    input: { token?: string | undefined } = {},
  ): Promise<CarbotiApiResponse> {
    return this.requestJson(
      `/api/carboti/processor-deliveries/${encodePathSegment(deliveryId)}/retry`,
      {
        method: "POST",
        token: input.token,
      },
    );
  }

  async requestJson<T = CarbotiApiResponse>(
    path: string,
    options: CarbotiRequestOptions = {},
  ): Promise<T> {
    const headers = new Headers(options.headers);
    const token = options.token ?? this.token;
    if (token) headers.set("authorization", `Bearer ${token}`);

    let body = options.body;
    if (options.json !== undefined) {
      if (!headers.has("content-type")) headers.set("content-type", "application/json");
      body = JSON.stringify(options.json);
    }

    const requestInit: RequestInit = {
      headers,
      method: options.method ?? "GET",
    };
    if (body !== undefined) requestInit.body = body;

    const response = await this.fetchFn(resolveUrl(this.baseUrl, path), requestInit);
    const payload = await readJsonResponse(response);

    if (!response.ok) {
      throw new CarbotiApiError({
        body: payload,
        code: readErrorCode(payload, response.status),
        message: readErrorMessage(payload, response.status),
        status: response.status,
      });
    }

    return payload as T;
  }
}

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
}

function resolveUrl(baseUrl: string, path: string): string {
  return new URL(path.replace(/^\//, ""), baseUrl).toString();
}

function encodePathSegment(value: string): string {
  return encodeURIComponent(value);
}

async function readJsonResponse(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function readErrorCode(payload: unknown, status: number): string {
  if (isRecord(payload) && typeof payload.code === "string") return payload.code;
  return `http_${status}`;
}

function readErrorMessage(payload: unknown, status: number): string {
  if (isRecord(payload) && typeof payload.message === "string") return payload.message;
  return `Carboti API request failed with HTTP ${status}.`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
