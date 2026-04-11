import { execFileSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import {
  API_ROOT_DIR,
  DEFAULT_TEST_ENV,
  RUNTIME_ENV_PATH,
  RuntimeTestEnv,
} from './test-env.constants';

function resolveBaseDatabaseUrl(): string {
  return (
    process.env.TEST_DATABASE_URL ??
    process.env.DATABASE_URL ??
    'postgresql://postgres:postgres@localhost:5432/swisskit'
  );
}

function buildRuntimeEnv(): RuntimeTestEnv {
  const baseDatabaseUrl = resolveBaseDatabaseUrl();
  const schema = `itest_${Date.now()}_${randomUUID().replace(/-/g, '').slice(0, 8)}`;

  const databaseUrl = new URL(baseDatabaseUrl);
  databaseUrl.searchParams.set('schema', schema);

  return {
    DATABASE_URL: databaseUrl.toString(),
    TEST_DB_SCHEMA: schema,
    TEST_BASE_DATABASE_URL: baseDatabaseUrl,
  };
}

function runMigrations(env: Record<string, string>): void {
  try {
    execFileSync(
      'pnpm',
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
