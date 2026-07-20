import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import {
  API_ROOT_DIR,
  DEFAULT_TEST_ENV,
  RUNTIME_ENV_PATH,
  RuntimeTestEnv,
} from './test-env.constants';
import { assertSafeIntegrationTestDatabaseUrl } from './test-database-url';
import { runPinnedPnpm } from './run-pinned-pnpm';

function resolveTestDatabaseUrl(): string {
  const testDatabaseUrl = process.env.TEST_DATABASE_URL;

  if (!testDatabaseUrl) {
    throw new Error(
      'TEST_DATABASE_URL is required for API integration tests. DATABASE_URL is never used by integration tests.',
    );
  }

  assertSafeIntegrationTestDatabaseUrl(testDatabaseUrl, 'TEST_DATABASE_URL');

  return testDatabaseUrl;
}

function buildRuntimeEnv(): RuntimeTestEnv {
  const baseDatabaseUrl = resolveTestDatabaseUrl();
  const databaseUrl = new URL(baseDatabaseUrl);
  databaseUrl.searchParams.delete('schema');

  return {
    DATABASE_URL: databaseUrl.toString(),
  };
}

function runMigrations(env: Record<string, string>): void {
  try {
    runPinnedPnpm(
      ['prisma', 'migrate', 'deploy', '--config', 'prisma.config.ts'],
      {
        cwd: API_ROOT_DIR,
        env: {
          ...process.env,
          ...env,
        },
        stdio: 'pipe',
      },
    );
  } catch (error) {
    const stdout =
      typeof error === 'object' && error !== null && 'stdout' in error
        ? String((error as { stdout?: Buffer }).stdout ?? '')
        : '';
    const stderr =
      typeof error === 'object' && error !== null && 'stderr' in error
        ? String((error as { stderr?: Buffer }).stderr ?? '')
        : '';

    throw new Error(
      [
        'Failed to prepare integration test database.',
        stdout && `stdout:\n${stdout}`,
        stderr && `stderr:\n${stderr}`,
      ]
        .filter(Boolean)
        .join('\n\n'),
    );
  }
}

export default async function globalSetup(): Promise<void> {
  const runtimeEnv = buildRuntimeEnv();
  const fullEnv = {
    ...DEFAULT_TEST_ENV,
    ...runtimeEnv,
  };

  mkdirSync(path.dirname(RUNTIME_ENV_PATH), { recursive: true });
  writeFileSync(RUNTIME_ENV_PATH, JSON.stringify(fullEnv, null, 2));

  runMigrations(fullEnv);
}
