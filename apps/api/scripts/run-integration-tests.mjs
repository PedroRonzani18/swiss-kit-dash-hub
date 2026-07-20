import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const runtimeDirectory = mkdtempSync(join(tmpdir(), 'swisskit-api-integration-'));
const env = {
  ...process.env,
  API_TEST_RUNTIME_ENV_PATH: join(runtimeDirectory, 'runtime-env.json'),
};

try {
  execFileSync('corepack', [
    'pnpm@10.33.0',
    'exec',
    'jest',
    '--config',
    'jest.integration.config.js',
    '--passWithNoTests',
  ], {
    env,
    stdio: 'inherit',
  });
} finally {
  rmSync(runtimeDirectory, { recursive: true, force: true });
}
