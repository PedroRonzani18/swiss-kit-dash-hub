#!/usr/bin/env node
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  commandArgs,
  exitWithUsage,
  formatLocalTimestamp,
  relativeToRepo,
  runDir,
  slugFromRequest,
  validateRunId,
  writeState,
} from './lib.mjs';

const usage = `
Usage:
  pnpm pipeline:create-run -- "<request>" [--run-id <run-id>]
`;

function parseArgs(argv) {
  const requestParts = [];
  let runId = null;

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];

    if (value === '--run-id') {
      if (!argv[index + 1] || argv[index + 1].startsWith('--')) {
        throw new Error('--run-id requires a value.');
      }

      runId = argv[index + 1];
      index += 1;
      continue;
    }

    requestParts.push(value);
  }

  return {
    request: requestParts.join(' ').trim(),
    runId,
  };
}

try {
  const { request, runId: providedRunId } = parseArgs(commandArgs());

  if (!request) {
    exitWithUsage(usage, 'Request is required.');
  }

  const runId = providedRunId ?? `${slugFromRequest(request)}-${formatLocalTimestamp()}`;

  validateRunId(runId);

  const directory = runDir(runId);

  if (existsSync(directory)) {
    throw new Error(`Refusing to reuse existing run directory: ${relativeToRepo(directory)}`);
  }

  mkdirSync(directory, { recursive: false });
  writeFileSync(join(directory, 'request.md'), `${request}\n`, 'utf8');
  writeState(runId, {
    version: 1,
    runId,
    status: 'planning',
    attempt: 0,
    lastVerdict: null,
    updatedAt: new Date().toISOString(),
  });

  console.log(`created ${relativeToRepo(directory)}`);
  console.log(`runId ${runId}`);
  console.log('status planning');
} catch (error) {
  exitWithUsage(usage, error.message);
}
