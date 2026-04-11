import { existsSync, readFileSync } from 'node:fs';
import { RUNTIME_ENV_PATH } from './test-env.constants';

if (existsSync(RUNTIME_ENV_PATH)) {
  const runtimeEnv = JSON.parse(
    readFileSync(RUNTIME_ENV_PATH, 'utf-8'),
  ) as Record<string, string>;

  for (const [key, value] of Object.entries(runtimeEnv)) {
    process.env[key] = value;
  }
}
