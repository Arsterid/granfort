export type ApiDataResponse<T> = {
  data: T;
};

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
    public readonly payload?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: BodyInit | null;
  json?: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

async function readResponseBody(response: Response): Promise<unknown> {
  if (response.status === 204) return undefined;

  const text = await response.text();

  if (!text) return undefined;

  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("json")) {
    return text;
  }

  try {
    return JSON.parse(text);
  } catch {
    if (!response.ok) return text;

    throw new ApiError("Server returned incorrect JSON.", response.status);
  }
}

function createApiError(payload: unknown, status: number): ApiError {
  const root = isRecord(payload) ? payload : null;
  const error = root && isRecord(root.error) ? root.error : root;

  const message =
    typeof error?.message === "string"
      ? error.message
      : typeof payload === "string" && payload.trim()
        ? payload
        : `HTTP ${status} request failed.`;

  const code = typeof error?.code === "string" ? error.code : undefined;

  return new ApiError(message, status, code, payload);
}

export async function apiRequest<T>(
  input: RequestInfo | URL,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { body, json, headers: initialHeaders, ...requestOptions } = options;

  if (body != null && json !== undefined) {
    throw new TypeError("Use either body or json, not both.");
  }

  const headers = new Headers(initialHeaders);

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  let requestBody = body;

  if (json !== undefined) {
    const serialized = JSON.stringify(json);

    if (serialized === undefined) {
      throw new TypeError("Request body cannot be serialized to JSON.");
    }

    headers.set("Content-Type", "application/json");
    requestBody = serialized;
  }

  const response = await fetch(input, {
    ...requestOptions,
    headers,
    body: requestBody,
  });

  const payload = await readResponseBody(response);

  if (!response.ok) {
    throw createApiError(payload, response.status);
  }

  return payload as T;
}
