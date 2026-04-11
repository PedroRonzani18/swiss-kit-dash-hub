import { existsSync, rmSync } from 'node:fs';
import { RUNTIME_ENV_PATH } from './test-env.constants';

export default async function globalTeardown(): Promise<void> {
  if (!existsSync(RUNTIME_ENV_PATH)) {
    return;
  }

  rmSync(RUNTIME_ENV_PATH, { force: true });
}
