# HTTP Client

The web app uses the fetch-based client in `src/api/client.ts`.

## Goals

The client should keep API usage predictable by centralizing:

- API base URL normalization;
- cookie credentials;
- JSON headers;
- API error normalization;
- optional response validation with shared Zod contracts.

## Compatibility API

Existing callers can continue using:

```ts
apiClient.get<TResponse>('/path')
apiClient.post<TResponse, TBody>('/path', body)
apiClient.patch<TResponse, TBody>('/path', body)
apiClient.delete('/path')
```

These helpers return typed responses but do not validate payloads at runtime.

## Schema-aware API

For shared contracts, prefer schema-aware helpers:

```ts
apiClient.getWithSchema('/auth/me', CurrentUserSchema)
apiClient.postWithSchema('/items', input, ItemSchema)
apiClient.patchWithSchema('/items/1', input, ItemSchema)
```

Schema-aware helpers parse the response and throw `ApiParseError` when the API payload does not match the expected contract.

## Error behavior

Failed HTTP responses throw `ApiError`.

The client attempts to parse the backend error envelope using `ApiErrorSchema.partial()` and falls back to the response status text when the body is not JSON or does not match the known shape.

## Rules

- Keep endpoint-specific functions in `src/api/*`.
- Do not call `fetch` directly from modules or components.
- Prefer shared schemas from `@swisskit/contracts` when the payload crosses the API/web boundary.
- Do not add Axios unless there is a specific feature gap that fetch cannot cover.
