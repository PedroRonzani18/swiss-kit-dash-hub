#!/usr/bin/env node
import {
  commandArgs,
  exitWithUsage,
  readState,
  validateRunId,
  validateStatus,
  validateVerdict,
  writeState,
} from './lib.mjs';

const usage = `
Usage:
  pnpm pipeline:set-state -- <run-id> <status> [--attempt 0|1|2] [--verdict "SHIP|NEEDS WORK|BLOCK|null"]
`;

function parseArgs(argv) {
  const [runId, status, ...rest] = argv;
  const options = {
    runId,
    status,
    attempt: undefined,
    verdict: undefined,
  };

  for (let index = 0; index < rest.length; index += 1) {
    const value = rest[index];

    if (value === '--attempt') {
      options.attempt = Number(rest[index + 1]);
      index += 1;
      continue;
    }

    if (value === '--verdict') {
      options.verdict = rest[index + 1] === 'null' ? null : rest[index + 1];
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${value}`);
  }

  return options;
}

try {
  const { runId, status, attempt, verdict } = parseArgs(commandArgs());

  validateRunId(runId);
  validateStatus(status);

  if (attempt !== undefined && (!Number.isInteger(attempt) || attempt < 0 || attempt > 2)) {
    throw new Error('Attempt must be 0, 1 or 2.');
  }

  if (verdict !== undefined) {
    validateVerdict(verdict);
  }

  const currentState = readState(runId);
  const nextState = {
    ...currentState,
    status,
    attempt: attempt ?? currentState.attempt,
    lastVerdict: verdict === undefined ? currentState.lastVerdict : verdict,
    updatedAt: new Date().toISOString(),
  };

  writeState(runId, nextState);

  console.log(JSON.stringify(nextState, null, 2));
} catch (error) {
  exitWithUsage(usage, error.message);
}
