import { ApiErrorSchema } from '@swisskit/contracts/api';
import type { z } from 'zod';
import {
  ApiError,
  ApiParseError,
  type ApiErrorResponse,
} from '@/types/api';

const DEFAULT_API_URL = '/api';

type RequestJsonOptions<TSchema extends z.ZodTypeAny | undefined = undefined> = {
  init?: RequestInit;
  schema?: TSchema;
};

type InferSchema<TSchema extends z.ZodTypeAny | undefined> =
  TSchema extends z.ZodTypeAny ? z.infer<TSchema> : unknown;

function normalizeApiUrl(baseUrl: string): string {
  return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
}

export const API_BASE_URL = normalizeApiUrl(
  import.meta.env.VITE_API_URL || DEFAULT_API_URL,
);

export function getApiOrigin(): string {
  return new URL(API_BASE_URL, window.location.origin).origin;
}

function buildUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

function buildHeaders(init?: HeadersInit, withJsonBody?: boolean): Headers {
  const headers = new Headers(init);

  if (withJsonBody && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }

  return headers;
}

function hasJsonContent(response: Response): boolean {
  return response.headers.get('content-type')?.includes('application/json') ?? false;
}

async function parseJsonResponse(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return undefined;
  }

  if (!hasJsonContent(response)) {
    return undefined;
  }

  return response.json();
}

async function parseError(response: Response): Promise<ApiError> {
  let details: ApiErrorResponse | undefined;

  try {
    const payload = await parseJsonResponse(response);
    const parsedError = ApiErrorSchema.partial().safeParse(payload);
    details = parsedError.success ? parsedError.data : undefined;
  } catch {
    details = undefined;
  }

  const messageFromDetails = Array.isArray(details?.message)
    ? details?.message.join(', ')
    : details?.message;

  const message =
    messageFromDetails ||
    details?.error ||
    response.statusText ||
    'API request failed';

  return new ApiError(response.status, message, details);
}

export async function requestJson<
  TSchema extends z.ZodTypeAny | undefined = undefined,
>(
  path: string,
  options: RequestJsonOptions<TSchema> = {},
): Promise<InferSchema<TSchema>> {
  const withJsonBody = Boolean(options.init?.body);
  const response = await fetch(buildUrl(path), {
    ...options.init,
    credentials: 'include',
    headers: buildHeaders(options.init?.headers, withJsonBody),
  });

  if (!response.ok) {
    throw await parseError(response);
  }

  const payload = await parseJsonResponse(response);

  if (!options.schema) {
    return payload as InferSchema<TSchema>;
  }

  const parsedPayload = options.schema.safeParse(payload);

  if (!parsedPayload.success) {
    throw new ApiParseError();
  }

  return parsedPayload.data as InferSchema<TSchema>;
}

export async function apiRequest<TResponse>(
  path: string,
  init?: RequestInit,
): Promise<TResponse> {
  return requestJson(path, { init }) as Promise<TResponse>;
}

export const apiClient = {
  get: <TResponse>(path: string) => apiRequest<TResponse>(path, { method: 'GET' }),
  getWithSchema: <TSchema extends z.ZodTypeAny>(path: string, schema: TSchema) =>
    requestJson(path, { init: { method: 'GET' }, schema }),
  post: <TResponse, TBody>(path: string, body: TBody) =>
    apiRequest<TResponse>(path, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  postWithSchema: <TSchema extends z.ZodTypeAny, TBody>(
    path: string,
    body: TBody,
    schema: TSchema,
  ) =>
    requestJson(path, {
      init: {
        method: 'POST',
        body: JSON.stringify(body),
      },
      schema,
    }),
  patch: <TResponse, TBody>(path: string, body: TBody) =>
    apiRequest<TResponse>(path, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),
  patchWithSchema: <TSchema extends z.ZodTypeAny, TBody>(
    path: string,
    body: TBody,
    schema: TSchema,
  ) =>
    requestJson(path, {
      init: {
        method: 'PATCH',
        body: JSON.stringify(body),
      },
      schema,
    }),
  delete: (path: string) =>
    apiRequest<void>(path, {
      method: 'DELETE',
    }),
};
