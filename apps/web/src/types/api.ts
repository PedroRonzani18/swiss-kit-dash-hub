export type ApiErrorResponse = {
  statusCode?: number;
  message?: string | string[];
  error?: string;
};

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
