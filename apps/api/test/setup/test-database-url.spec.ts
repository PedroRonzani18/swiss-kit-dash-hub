import {
  DEFAULT_TEST_DATABASE_URL,
  resolveTestDatabaseUrl,
} from './test-database-url';

describe('resolveTestDatabaseUrl', () => {
  it('uses the isolated local test schema by default', () => {
    expect(resolveTestDatabaseUrl(undefined)).toBe(DEFAULT_TEST_DATABASE_URL);
  });

  it('preserves a configured isolated schema', () => {
    const configuredUrl =
      'postgresql://postgres:postgres@localhost:5432/swisskit?schema=custom_test';

    expect(resolveTestDatabaseUrl(configuredUrl)).toBe(configuredUrl);
  });

  it.each([
    'postgresql://postgres:postgres@localhost:5432/swisskit',
    'postgresql://postgres:postgres@localhost:5432/swisskit?schema=public',
  ])('rejects a database URL without an isolated schema: %s', (url) => {
    expect(() => resolveTestDatabaseUrl(url)).toThrow(
      'TEST_DATABASE_URL must target an isolated, non-public PostgreSQL schema.',
    );
  });

  it('rejects unsafe schema names', () => {
    expect(() =>
      resolveTestDatabaseUrl(
        'postgresql://postgres:postgres@localhost:5432/swisskit?schema=unsafe-schema',
      ),
    ).toThrow(
      'TEST_DATABASE_URL schema must use lowercase letters, numbers, and underscores.',
    );
  });

  it('rejects non-PostgreSQL URLs', () => {
    expect(() =>
      resolveTestDatabaseUrl('mysql://localhost/swisskit?schema=swisskit_test'),
    ).toThrow('TEST_DATABASE_URL must use the PostgreSQL protocol.');
  });
});
