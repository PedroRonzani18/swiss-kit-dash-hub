#!/usr/bin/env node
import { existsSync, renameSync } from 'node:fs';
import { join } from 'node:path';
import { commandArgs, exitWithUsage, relativeToRepo, runDir, validateRunId } from './lib.mjs';

const usage = `
Usage:
  pnpm pipeline:archive-review -- <run-id>
`;

try {
  const [runId] = commandArgs();
  validateRunId(runId);

  const directory = runDir(runId);
  const reviewPath = join(directory, 'review.md');
  const archivePath = join(directory, 'review-attempt-1.md');

  if (!existsSync(directory)) {
    throw new Error(`Missing run directory: ${relativeToRepo(directory)}`);
  }

  if (!existsSync(reviewPath)) {
    throw new Error(`Missing review file: ${relativeToRepo(reviewPath)}`);
  }

  if (existsSync(archivePath)) {
    throw new Error(`Refusing to overwrite existing archive: ${relativeToRepo(archivePath)}`);
  }

  renameSync(reviewPath, archivePath);

  console.log(`archived ${relativeToRepo(reviewPath)} -> ${relativeToRepo(archivePath)}`);
} catch (error) {
  exitWithUsage(usage, error.message);
}
