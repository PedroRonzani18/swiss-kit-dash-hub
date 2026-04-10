import { ApiError } from '@/types/api';

export function isConflictError(error: unknown): boolean {
  return error instanceof ApiError && error.status === 409;
}
