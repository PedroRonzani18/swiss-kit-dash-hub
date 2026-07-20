import { assertSafeIntegrationTestDatabaseUrl } from './test-database-url';

describe('assertSafeIntegrationTestDatabaseUrl', () => {
  const validUrl =
    'postgresql://postgres:postgres@127.0.0.1:5432/swisskit_test?application_name=swisskit-integration-test';

  it('accepts a marked loopback test database URL', () => {
    expect(assertSafeIntegrationTestDatabaseUrl(validUrl, 'TEST_DATABASE_URL')).toBeInstanceOf(URL);
  });

  it('rejects a marked remote database URL', () => {
    expect(() =>
      assertSafeIntegrationTestDatabaseUrl(
        validUrl.replace('127.0.0.1', 'staging.example.com'),
        'TEST_DATABASE_URL',
      ),
    ).toThrow('loopback host');
  });

  it('rejects an unmarked loopback database URL', () => {
    expect(() =>
      assertSafeIntegrationTestDatabaseUrl(
        'postgresql://postgres:postgres@localhost:5432/swisskit_test',
        'TEST_DATABASE_URL',
      ),
    ).toThrow('application_name=swisskit-integration-test');
  });
});
