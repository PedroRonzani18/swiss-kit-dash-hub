#!/usr/bin/env node
import { existsSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(fileURLToPath(new URL('../..', import.meta.url)));

const lockfiles = new Set(['pnpm-lock.yaml', 'bun.lock', 'bun.lockb']);
const envExamplePattern = /(^|\/)\.env\.(example|sample|template)$/;

function normalizePath(value) {
  if (typeof value !== 'string' || value.trim() === '') {
    return null;
  }

  const trimmed = value.trim().replace(/^['"]|['"]$/g, '');

  if (/^[a-z]+:\/\//i.test(trimmed)) {
    return null;
  }

  const absolute = resolve(repoRoot, trimmed);
  const relativePath = relative(repoRoot, absolute).replaceAll('\\', '/');

  if (relativePath === '' || relativePath.startsWith('../') || relativePath === '..') {
    return null;
  }

  return relativePath;
}

function classifyPath(path) {
  if (path === '.git' || path.startsWith('.git/')) {
    return 'the Git internals directory is not editable by Codex';
  }

  if (lockfiles.has(path)) {
    return 'lockfiles must not be edited manually';
  }

  const basename = path.split('/').at(-1) ?? '';
  if (basename.startsWith('.env') && !envExamplePattern.test(path)) {
    return 'real environment files must not be edited';
  }

  if (path.startsWith('apps/api/prisma/migrations/') && existsSync(resolve(repoRoot, path))) {
    return 'existing Prisma migrations must not be rewritten';
  }

  return null;
}

function collectStrings(value, results = []) {
  if (typeof value === 'string') {
    results.push(value);
    return results;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      collectStrings(item, results);
    }
    return results;
  }

  if (value && typeof value === 'object') {
    for (const item of Object.values(value)) {
      collectStrings(item, results);
    }
  }

  return results;
}

function extractPatchPaths(command) {
  if (typeof command !== 'string') {
    return [];
  }

  const paths = [];
  const patchPathPattern = /^\*\*\* (?:Add|Update|Delete) File: (.+)$/gm;
  let match = patchPathPattern.exec(command);

  while (match) {
    paths.push(match[1]);
    match = patchPathPattern.exec(command);
  }

  return paths;
}

function extractShellPathCandidates(command) {
  if (typeof command !== 'string') {
    return [];
  }

  if (!isMutatingShellCommand(command)) {
    return [];
  }

  const candidates = [];
  const tokenPattern = /(?:^|[\s"'`])((?:\.\/)?(?:\.git(?:\/[^\s"'`]+)?|[^\s"'`]*\.env[^\s"'`]*|pnpm-lock\.yaml|bun\.lockb?|apps\/api\/prisma\/migrations\/[^\s"'`]+))(?:$|[\s"'`])/g;
  let match = tokenPattern.exec(command);

  while (match) {
    candidates.push(match[1].replace(/^\.\//, ''));
    match = tokenPattern.exec(command);
  }

  return candidates;
}

function isMutatingShellCommand(command) {
  const normalized = command.trim();

  if (/[^\d]>>?\s*\S/.test(` ${normalized}`)) {
    return true;
  }

  return /\b(rm|mv|cp|touch|chmod|chown|truncate|install|tee)\b/.test(normalized)
    || /\bsed\b[^|;&]*\s-i\b/.test(normalized)
    || /\bperl\b[^|;&]*\s-pi\b/.test(normalized)
    || /\bgit\s+(?:add|checkout|restore|reset)\b/.test(normalized);
}

function deny(reason, paths) {
  const uniquePaths = Array.from(new Set(paths)).sort();
  const pathText = uniquePaths.length > 0 ? ` Protected paths: ${uniquePaths.join(', ')}.` : '';

  process.stdout.write(
    `${JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason: `${reason}.${pathText}`,
      },
    })}\n`,
  );
}

function main() {
  let input = '';

  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (chunk) => {
    input += chunk;
  });
  process.stdin.on('end', () => {
    const payload = input.trim() ? JSON.parse(input) : {};
    const toolInput = payload.tool_input ?? {};
    const toolName = payload.tool_name ?? '';
    const strings = collectStrings(toolInput);
    const candidates = new Set();

    if (toolName === 'apply_patch') {
      for (const path of extractPatchPaths(toolInput.command)) {
        candidates.add(path);
      }
    }

    for (const value of strings) {
      for (const path of extractShellPathCandidates(value)) {
        candidates.add(path);
      }
    }

    const violations = [];

    for (const candidate of candidates) {
      const path = normalizePath(candidate);
      const reason = path ? classifyPath(path) : null;

      if (reason) {
        violations.push({ path, reason });
      }
    }

    if (violations.length > 0) {
      const firstReason = violations[0].reason;
      deny(firstReason, violations.map((violation) => violation.path));
    }
  });
}

main();
