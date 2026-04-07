import { ApiError, type ApiErrorResponse } from '@/types/api';

const DEFAULT_API_URL = '/api';

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

  return headers;
}

async function parseError(response: Response): Promise<ApiError> {
  let details: ApiErrorResponse | undefined;

  try {
    details = (await response.json()) as ApiErrorResponse;
  } catch {
    details = undefined;
  }

  const messageFromDetails = Array.isArray(details?.message)
    ? details?.message.join(', ')
    : details?.message;

  const message =
    messageFromDetails || details?.error || response.statusText || 'API request failed';

  return new ApiError(response.status, message, details);
}

export async function apiRequest<TResponse>(
  path: string,
  init?: RequestInit,
): Promise<TResponse> {
  const withJsonBody = Boolean(init?.body);
  const response = await fetch(buildUrl(path), {
    ...init,
    credentials: 'include',
    headers: buildHeaders(init?.headers, withJsonBody),
  });

  if (!response.ok) {
    throw await parseError(response);
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  return (await response.json()) as TResponse;
}

export const apiClient = {
  get: <TResponse>(path: string) => apiRequest<TResponse>(path, { method: 'GET' }),
  post: <TResponse, TBody>(path: string, body: TBody) =>
    apiRequest<TResponse>(path, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  patch: <TResponse, TBody>(path: string, body: TBody) =>
    apiRequest<TResponse>(path, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),
  delete: (path: string) =>
    apiRequest<void>(path, {
      method: 'DELETE',
    }),
};
