export const DEFAULT_TEST_DATABASE_URL =
  'postgresql://postgres:postgres@localhost:5432/swisskit?schema=swisskit_test';

const SAFE_SCHEMA_PATTERN = /^[a-z_][a-z0-9_]*$/;

export function resolveTestDatabaseUrl(configuredUrl?: string): string {
  const rawUrl = configuredUrl ?? DEFAULT_TEST_DATABASE_URL;
  const databaseUrl = new URL(rawUrl);
  const schema = databaseUrl.searchParams.get('schema');

  if (!['postgres:', 'postgresql:'].includes(databaseUrl.protocol)) {
    throw new Error('TEST_DATABASE_URL must use the PostgreSQL protocol.');
  }

  if (!schema || schema === 'public') {
    throw new Error(
      'TEST_DATABASE_URL must target an isolated, non-public PostgreSQL schema.',
    );
  }

  if (!SAFE_SCHEMA_PATTERN.test(schema)) {
    throw new Error(
      'TEST_DATABASE_URL schema must use lowercase letters, numbers, and underscores.',
    );
  }

  return databaseUrl.toString();
}
