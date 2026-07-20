#!/usr/bin/env node
import { copyFileSync, existsSync } from 'node:fs';
import { assertNodeVersion, prepareAndAssertPnpmVersion, runPnpm } from './lib/runtime.mjs';

const environmentFiles = [
  {
    source: 'apps/web/.env.example',
    target: 'apps/web/.env.local',
  },
  {
    source: 'apps/api/.env.example',
    target: 'apps/api/.env',
  },
];

function createEnvironmentFiles() {
  for (const { source, target } of environmentFiles) {
    if (existsSync(target)) {
      console.log(`kept existing ${target}`);
      continue;
    }

    copyFileSync(source, target);
    console.log(`created ${target} from ${source}`);
  }
}

assertNodeVersion();
prepareAndAssertPnpmVersion();
createEnvironmentFiles();
runPnpm(['install', '--frozen-lockfile']);
runPnpm(['--filter', 'api', 'prisma:generate']);
console.log('\nSetup complete. Next steps:');
console.log('1. Review local environment values in apps/web/.env.local and apps/api/.env.');
console.log('2. Start PostgreSQL with pnpm db:up, then run pnpm db:migrate and pnpm db:seed.');
console.log('3. Start the applications with pnpm dev.');
