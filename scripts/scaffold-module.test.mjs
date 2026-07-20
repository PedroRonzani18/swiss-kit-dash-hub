import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const scriptPath = fileURLToPath(new URL('./scaffold-module.mjs', import.meta.url));

function runScaffold(root, args) {
  return execFileSync(process.execPath, [scriptPath, ...args], {
    encoding: 'utf8',
    env: { ...process.env, SWISSKIT_SCAFFOLD_ROOT: root },
  });
}

test('scaffold creates only the files requested by each supported mode', () => {
  const root = mkdtempSync(join(tmpdir(), 'swisskit-scaffold-'));

  try {
    const modes = [
      ['web-only', true, false, false],
      ['api-only', false, true, false],
      ['contracts-only', false, false, true],
      ['full-stack', true, true, true],
    ];

    for (const [type, expectsWeb, expectsApi, expectsContracts] of modes) {
      const moduleId = `${type}-module`;
      const pascalName = moduleId
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join('');
      const output = runScaffold(root, [moduleId, '--type', type]);

      assert.match(output, /No routes, navigation entries, permissions/);
      assert.equal(
        existsSync(join(root, `apps/web/src/modules/${moduleId}/pages/${pascalName}Page.tsx`)),
        expectsWeb,
      );
      assert.equal(
        existsSync(join(root, `apps/api/src/modules/${moduleId}/${moduleId}.module.ts`)),
        expectsApi,
      );
      assert.equal(
        existsSync(join(root, `packages/contracts/src/${moduleId}.ts`)),
        expectsContracts,
      );
    }

    assert.equal(existsSync(join(root, 'apps/web/src/app/navigation/modules.ts')), false);
    assert.equal(existsSync(join(root, 'packages/contracts/src/index.ts')), false);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('scaffold refuses to overwrite an existing generated file', () => {
  const root = mkdtempSync(join(tmpdir(), 'swisskit-scaffold-'));

  try {
    runScaffold(root, ['tickets', '--type', 'web-only']);
    const result = spawnSync(
      process.execPath,
      [scriptPath, 'tickets', '--type', 'web-only'],
      {
        encoding: 'utf8',
        env: { ...process.env, SWISSKIT_SCAFFOLD_ROOT: root },
      },
    );

    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Refusing to overwrite existing file/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('scaffold requires an explicit supported type', () => {
  const root = mkdtempSync(join(tmpdir(), 'swisskit-scaffold-'));

  try {
    const result = spawnSync(process.execPath, [scriptPath, 'tickets'], {
      encoding: 'utf8',
      env: { ...process.env, SWISSKIT_SCAFFOLD_ROOT: root },
    });

    assert.notEqual(result.status, 0);
    assert.match(
      result.stderr,
      /A module id and supported --type are required/,
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
