#!/usr/bin/env node
import { assertNodeVersion, runPnpm } from './lib/runtime.mjs';

assertNodeVersion();
runPnpm(['lint:ci']);
runPnpm(['typecheck']);
runPnpm(['--filter', 'api', 'prisma:generate']);
runPnpm(['test:scripts']);
runPnpm(['test:web']);
runPnpm(['test:api']);
