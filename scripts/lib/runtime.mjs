import { execFileSync } from 'node:child_process';

const REQUIRED_NODE_MAJOR = 24;
const REQUIRED_PNPM_VERSION = '10.33.0';

export function assertNodeVersion() {
  const major = Number.parseInt(process.versions.node.split('.')[0], 10);

  if (major !== REQUIRED_NODE_MAJOR) {
    throw new Error(
      `Swiss Kit requires Node.js ${REQUIRED_NODE_MAJOR}. Current version: ${process.version}.`,
    );
  }
}

export function run(command, args, options = {}) {
  execFileSync(command, args, {
    stdio: 'inherit',
    ...options,
  });
}

export function prepareAndAssertPnpmVersion() {
  try {
    run('corepack', ['prepare', `pnpm@${REQUIRED_PNPM_VERSION}`]);
  } catch {
    throw new Error(
      `Unable to prepare pnpm ${REQUIRED_PNPM_VERSION} with Corepack. Install Corepack, then rerun pnpm bootstrap.`,
    );
  }

  const installedVersion = execFileSync('corepack', [
    `pnpm@${REQUIRED_PNPM_VERSION}`,
    '--version',
  ], {
    encoding: 'utf8',
  }).trim();

  if (installedVersion !== REQUIRED_PNPM_VERSION) {
    throw new Error(
      `Swiss Kit requires pnpm ${REQUIRED_PNPM_VERSION}. Current version: ${installedVersion}. Run corepack prepare pnpm@${REQUIRED_PNPM_VERSION} and rerun pnpm bootstrap.`,
    );
  }
}

export function runPnpm(args, options = {}) {
  run('corepack', [`pnpm@${REQUIRED_PNPM_VERSION}`, ...args], options);
}
