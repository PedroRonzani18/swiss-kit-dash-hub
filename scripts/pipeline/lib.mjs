import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const repoRoot = join(__dirname, '..', '..');
export const runsRoot = join(repoRoot, '.pipeline', 'runs');

export const allowedStatuses = new Set([
  'planning',
  'awaiting-approval',
  'implementing',
  'testing',
  'reviewing',
  'needs-work',
  'blocked',
  'ready-for-human-review',
]);

export const allowedVerdicts = new Set(['SHIP', 'NEEDS WORK', 'BLOCK']);

export function fail(message) {
  console.error(`Error: ${message}`);
  process.exitCode = 1;
}

export function exitWithUsage(usage, message) {
  if (message) {
    console.error(`Error: ${message}`);
  }

  console.error(usage.trim());
  process.exit(1);
}

export function commandArgs() {
  const args = process.argv.slice(2);
  return args[0] === '--' ? args.slice(1) : args;
}

export function validateRunId(runId) {
  if (!runId || !/^[a-z0-9][a-z0-9-]*$/.test(runId)) {
    throw new Error('Run ID must match /^[a-z0-9][a-z0-9-]*$/');
  }
}

export function validateStatus(status) {
  if (!allowedStatuses.has(status)) {
    throw new Error(`Status must be one of: ${Array.from(allowedStatuses).join(', ')}`);
  }
}

export function validateVerdict(verdict) {
  if (verdict !== null && !allowedVerdicts.has(verdict)) {
    throw new Error(`Verdict must be one of: ${Array.from(allowedVerdicts).join(', ')}, null`);
  }
}

export function runDir(runId) {
  validateRunId(runId);
  return join(runsRoot, runId);
}

export function statePath(runId) {
  return join(runDir(runId), 'state.json');
}

export function relativeToRepo(path) {
  return relative(repoRoot, path);
}

export function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

export function readState(runId) {
  const path = statePath(runId);

  if (!existsSync(path)) {
    throw new Error(`Missing state file: ${relativeToRepo(path)}`);
  }

  const state = readJson(path);

  if (state.runId !== runId) {
    throw new Error(`State runId mismatch: expected ${runId}, found ${state.runId}`);
  }

  if (state.version !== 1) {
    throw new Error(`Unsupported state version: ${state.version}`);
  }

  validateStatus(state.status);
  validateVerdict(state.lastVerdict);

  if (!Number.isInteger(state.attempt) || state.attempt < 0 || state.attempt > 2) {
    throw new Error(`Attempt must be an integer from 0 to 2. Found: ${state.attempt}`);
  }

  return state;
}

export function writeState(runId, state) {
  validateRunId(runId);
  validateStatus(state.status);
  validateVerdict(state.lastVerdict);

  if (!Number.isInteger(state.attempt) || state.attempt < 0 || state.attempt > 2) {
    throw new Error(`Attempt must be an integer from 0 to 2. Found: ${state.attempt}`);
  }

  writeFileSync(statePath(runId), `${JSON.stringify(state, null, 2)}\n`, 'utf8');
}

export function formatLocalTimestamp(date = new Date()) {
  const pad = (value) => String(value).padStart(2, '0');

  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
    '-',
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds()),
  ].join('');
}

export function slugFromRequest(request) {
  const slug = request
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)
    .replace(/^-+|-+$/g, '');

  return slug || 'run';
}

export function latestVerdictFromText(text) {
  const matches = Array.from(text.matchAll(/VERDICT:\s*(SHIP|NEEDS WORK|BLOCK)\b/g));
  return matches.at(-1)?.[1] ?? null;
}
