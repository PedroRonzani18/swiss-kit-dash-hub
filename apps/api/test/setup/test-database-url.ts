const LOOPBACK_HOSTS = new Set(['127.0.0.1', 'localhost', '::1', '[::1]']);

export function assertSafeIntegrationTestDatabaseUrl(
  value: string | undefined,
  variableName: string,
): URL {
  if (!value) {
    throw new Error(`${variableName} is required for API integration tests.`);
  }

  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new Error(`${variableName} must be a valid PostgreSQL connection URL.`);
  }

  const databaseName = url.pathname.replace(/^\//, '');
  const marker = url.searchParams.get('application_name');

  if (!LOOPBACK_HOSTS.has(url.hostname)) {
    throw new Error(`${variableName} must use a loopback host for integration tests.`);
  }

  if (!databaseName.endsWith('_test') || marker !== 'swisskit-integration-test') {
    throw new Error(
      `${variableName} must target a *_test database and include application_name=swisskit-integration-test.`,
    );
  }

  return url;
}
