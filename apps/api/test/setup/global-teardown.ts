import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, rmSync } from 'node:fs';
import {
  API_ROOT_DIR,
  RUNTIME_ENV_PATH,
} from './test-env.constants';

export default async function globalTeardown(): Promise<void> {
  if (!existsSync(RUNTIME_ENV_PATH)) {
    return;
  }

  const runtimeEnv = JSON.parse(
    readFileSync(RUNTIME_ENV_PATH, 'utf-8'),
  ) as Record<string, string>;

  const schema = runtimeEnv.TEST_DB_SCHEMA;
  const baseDatabaseUrl = runtimeEnv.TEST_BASE_DATABASE_URL;

  if (schema && baseDatabaseUrl) {
    const adminUrl = new URL(baseDatabaseUrl);
    adminUrl.searchParams.delete('schema');
    const safeSchema = schema.replace(/"/g, '""');
    const dropSchemaQuery = `DROP SCHEMA IF EXISTS "${safeSchema}" CASCADE;`;

    execFileSync(
      'pnpm',
      ['prisma', 'db', 'execute', '--config', 'prisma.config.ts', '--stdin'],
      {
        cwd: API_ROOT_DIR,
        env: {
          ...process.env,
          ...runtimeEnv,
          DATABASE_URL: adminUrl.toString(),
        },
        input: dropSchemaQuery,
        stdio: 'pipe',
      },
    );
  }

  rmSync(RUNTIME_ENV_PATH, { force: true });
}
