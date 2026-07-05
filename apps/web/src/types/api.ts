import type { ApiErrorContract } from '@swisskit/contracts/api';

export type ApiErrorResponse = Partial<ApiErrorContract>;

export class ApiError extends Error {
  status: number;
  details?: ApiErrorResponse | unknown;

  constructor(status: number, message: string, details?: ApiErrorResponse | unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export class ApiParseError extends Error {
  constructor(message = 'API response could not be parsed') {
    super(message);
    this.name = 'ApiParseError';
  }
}
