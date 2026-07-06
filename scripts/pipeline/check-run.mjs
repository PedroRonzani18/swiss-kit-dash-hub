#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  commandArgs,
  exitWithUsage,
  latestVerdictFromText,
  readState,
  relativeToRepo,
  runDir,
  validateRunId,
} from './lib.mjs';

const usage = `
Usage:
  pnpm pipeline:check-run -- <run-id>
`;

const requiredArtifacts = [
  'request.md',
  'context.md',
  'spec.md',
  'changes.md',
  'test-results.md',
  'review.md',
  'state.json',
];

try {
  const [runId] = commandArgs();
  validateRunId(runId);

  const directory = runDir(runId);

  if (!existsSync(directory)) {
    throw new Error(`Missing run directory: ${relativeToRepo(directory)}`);
  }

  const state = readState(runId);
  const artifacts = requiredArtifacts.map((artifact) => {
    const path = join(directory, artifact);
    return {
      artifact,
      present: existsSync(path),
    };
  });
  const missingArtifacts = artifacts.filter((artifact) => !artifact.present).map((artifact) => artifact.artifact);
  const specPath = join(directory, 'spec.md');
  const reviewPath = join(directory, 'review.md');
  const specText = existsSync(specPath) ? readFileSync(specPath, 'utf8') : '';
  const reviewText = existsSync(reviewPath) ? readFileSync(reviewPath, 'utf8') : '';
  const openQuestionsMarker = /\bOPEN QUESTIONS\b/i.test(specText);
  const currentReviewVerdict = latestVerdictFromText(reviewText);

  console.log(`runId: ${state.runId}`);
  console.log(`status: ${state.status}`);
  console.log(`attempt: ${state.attempt}`);
  console.log(`lastVerdict: ${state.lastVerdict ?? 'null'}`);
  console.log(`updatedAt: ${state.updatedAt}`);
  console.log(`missingArtifacts: ${missingArtifacts.length > 0 ? missingArtifacts.join(', ') : 'none'}`);
  console.log(`openQuestionsMarker: ${openQuestionsMarker ? 'yes' : 'no'}`);
  console.log(`currentReviewVerdict: ${currentReviewVerdict ?? 'none'}`);
} catch (error) {
  exitWithUsage(usage, error.message);
}
