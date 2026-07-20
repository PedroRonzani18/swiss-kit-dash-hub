#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { assertNodeVersion, run, runPnpm } from './lib/runtime.mjs';

const composeFile = 'scripts/verify-compose.yml';
const projectName = `swisskit-verify-${process.pid}`;
const composeArgs = ['compose', '--project-name', projectName, '-f', composeFile];

function compose(args, options) {
  run('docker', [...composeArgs, ...args], options);
}

function resolveTestDatabaseUrl() {
  const publishedPort = execFileSync(
    'docker',
    [...composeArgs, 'port', 'postgres', '5432'],
    { encoding: 'utf8' },
  ).trim();
  const port = publishedPort.match(/:(\d+)$/)?.[1];

  if (!port) {
    throw new Error(`Could not determine PostgreSQL port from: ${publishedPort}`);
  }

  return `postgresql://postgres:postgres@127.0.0.1:${port}/swisskit_test?application_name=swisskit-integration-test`;
}

assertNodeVersion();

try {
  compose(['up', '--detach', '--wait']);
  const env = {
    ...process.env,
    TEST_DATABASE_URL: resolveTestDatabaseUrl(),
  };

  runPnpm(['test:ci'], { env });
  runPnpm(['test:web:e2e'], { env });
  runPnpm(['build:ci'], { env });
} finally {
  compose(['down', '--volumes', '--remove-orphans']);
}
