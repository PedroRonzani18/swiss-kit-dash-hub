#!/usr/bin/env node
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = process.env.SWISSKIT_SCAFFOLD_ROOT ?? join(__dirname, '..');
const scaffoldTypes = new Set(['web-only', 'api-only', 'contracts-only', 'full-stack']);

function usage() {
  console.log('Usage: pnpm scaffold:module -- <module-id> --type <web-only|api-only|contracts-only|full-stack>');
  console.log('Example: pnpm scaffold:module -- tickets --type full-stack');
}

function parseArgs(args) {
  const [moduleId, typeFlag, type] = args;

  if (!moduleId || typeFlag !== '--type' || !scaffoldTypes.has(type) || args.length !== 3) {
    usage();
    throw new Error('A module id and supported --type are required.');
  }

  if (!/^[a-z][a-z0-9-]*$/.test(moduleId)) {
    throw new Error('Module id must match /^[a-z][a-z0-9-]*$/.');
  }

  return { moduleId, type };
}

function toPascalCase(value) {
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function writeNewFile(relativePath, content) {
  const absolutePath = join(repoRoot, relativePath);

  if (existsSync(absolutePath)) {
    throw new Error(`Refusing to overwrite existing file: ${relativePath}`);
  }

  mkdirSync(dirname(absolutePath), { recursive: true });
  writeFileSync(absolutePath, content, 'utf8');
  console.log(`created ${relativePath}`);
}

function scaffoldWeb(moduleId, pascalName) {
  writeNewFile(
    `apps/web/src/modules/${moduleId}/pages/${pascalName}Page.tsx`,
    `export function ${pascalName}Page() {\n  return <main>${pascalName}</main>;\n}\n`,
  );
}

function scaffoldApi(moduleId, pascalName) {
  writeNewFile(
    `apps/api/src/modules/${moduleId}/${moduleId}.service.ts`,
    `import { Injectable } from '@nestjs/common';\n\n@Injectable()\nexport class ${pascalName}Service {}\n`,
  );
  writeNewFile(
    `apps/api/src/modules/${moduleId}/${moduleId}.controller.ts`,
    `import { Controller } from '@nestjs/common';\n\n@Controller('${moduleId}')\nexport class ${pascalName}Controller {}\n`,
  );
  writeNewFile(
    `apps/api/src/modules/${moduleId}/${moduleId}.module.ts`,
    `import { Module } from '@nestjs/common';\nimport { ${pascalName}Controller } from './${moduleId}.controller';\nimport { ${pascalName}Service } from './${moduleId}.service';\n\n@Module({\n  controllers: [${pascalName}Controller],\n  providers: [${pascalName}Service],\n})\nexport class ${pascalName}Module {}\n`,
  );
}

function scaffoldContracts(moduleId, pascalName) {
  writeNewFile(
    `packages/contracts/src/${moduleId}.ts`,
    `import { z } from 'zod';\n\nexport const ${pascalName}Schema = z.object({});\nexport type ${pascalName} = z.infer<typeof ${pascalName}Schema>;\n`,
  );
}

const { moduleId, type } = parseArgs(process.argv.slice(2));
const pascalName = toPascalCase(moduleId);

if (type === 'web-only' || type === 'full-stack') {
  scaffoldWeb(moduleId, pascalName);
}
if (type === 'api-only' || type === 'full-stack') {
  scaffoldApi(moduleId, pascalName);
}
if (type === 'contracts-only' || type === 'full-stack') {
  scaffoldContracts(moduleId, pascalName);
}

console.log('\nNo routes, navigation entries, permissions, app-module imports, or contract barrel exports were changed.');
console.log('Register only the pieces your feature requires after completing its implementation.');
