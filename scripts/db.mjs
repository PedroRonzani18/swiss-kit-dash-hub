#!/usr/bin/env node
import { assertNodeVersion, run, runPnpm } from './lib/runtime.mjs';

const commands = {
  up: ['compose', '-f', 'apps/api/docker-compose.yml', 'up', '-d'],
  down: ['compose', '-f', 'apps/api/docker-compose.yml', 'down'],
  logs: ['compose', '-f', 'apps/api/docker-compose.yml', 'logs', '--follow'],
  status: ['compose', '-f', 'apps/api/docker-compose.yml', 'ps'],
};

const prismaCommands = {
  migrate: ['--filter', 'api', 'prisma:migrate:dev'],
  seed: ['--filter', 'api', 'prisma:seed'],
};

const command = process.argv[2];

if (!command || (!commands[command] && !prismaCommands[command])) {
  console.error('Usage: pnpm db:<up|down|logs|status|migrate|seed>');
  process.exitCode = 1;
} else {
  assertNodeVersion();
  if (commands[command]) {
    run('docker', commands[command]);
  } else {
    runPnpm(prismaCommands[command]);
  }
}
