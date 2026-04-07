import ms, { type StringValue } from 'ms';

export function normalizeJwtExpiresIn(rawValue?: string): string {
  const normalizedRawValue = rawValue?.trim() || '1d';

  if (/^\d+$/.test(normalizedRawValue)) {
    const seconds = Number(normalizedRawValue);
    if (!Number.isFinite(seconds) || seconds <= 0) {
      throw new Error('JWT_EXPIRES_IN must be a positive duration');
    }

    return `${seconds}s`;
  }

  const parsedDuration = ms(normalizedRawValue as StringValue);
  if (!Number.isFinite(parsedDuration) || parsedDuration <= 0) {
    throw new Error(
      'JWT_EXPIRES_IN must be a positive duration (e.g. 1d, 12h, 30m, 3600)',
    );
  }

  return normalizedRawValue;
}

export function parseJwtExpiresInToMs(rawValue: string): number {
  const normalizedRawValue = rawValue.trim();

  if (/^\d+$/.test(normalizedRawValue)) {
    const seconds = Number(normalizedRawValue);
    if (Number.isFinite(seconds) && seconds > 0) {
      return seconds * 1000;
    }
  }

  const parsedDuration = ms(normalizedRawValue as StringValue);
  if (typeof parsedDuration === 'number' && parsedDuration > 0) {
    return parsedDuration;
  }

  throw new Error(
    `Invalid JWT_EXPIRES_IN value "${rawValue}". Use a positive duration like 1d, 12h, 30m or 3600.`,
  );
}
