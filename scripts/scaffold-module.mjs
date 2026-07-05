#!/usr/bin/env node
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..');

const moduleId = process.argv[2];

function usage() {
  console.log('Usage: pnpm scaffold:module <module-id>');
  console.log('Example: pnpm scaffold:module tasks');
}

function assertModuleId(value) {
  if (!value || !/^[a-z][a-z0-9-]*$/.test(value)) {
    usage();
    throw new Error('Module id must match /^[a-z][a-z0-9-]*$/');
  }
}

function toPascalCase(value) {
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function toCamelCase(value) {
  const pascal = toPascalCase(value);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
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

assertModuleId(moduleId);

const pascalName = toPascalCase(moduleId);
const camelName = toCamelCase(moduleId);
const pageName = `${pascalName}Page`;
const hookName = `use${pascalName}Overview`;

writeNewFile(
  `apps/web/src/modules/${moduleId}/pages/${pageName}.tsx`,
  `import { AppLayout } from "@/components/AppLayout";\nimport { ${hookName} } from "@/features/${moduleId}/hooks/${hookName}";\n\nexport function ${pageName}() {\n  const overviewQuery = ${hookName}();\n\n  return (\n    <AppLayout breadcrumbs={["SwissKit", "${pascalName}"]}>\n      <section className="mx-auto flex w-full max-w-5xl flex-col gap-6">\n        <div>\n          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">\n            ${pascalName}\n          </h1>\n          <p className="mt-2 text-sm text-muted-foreground">\n            Replace this placeholder with your module experience.\n          </p>\n        </div>\n\n        {overviewQuery.isLoading ? <p className="text-sm text-muted-foreground">Loading...</p> : null}\n        {overviewQuery.isError ? <p className="text-sm text-destructive">Failed to load.</p> : null}\n\n        {overviewQuery.data ? (\n          <pre className="overflow-auto rounded-2xl border border-border/70 bg-card/70 p-5 text-xs text-muted-foreground shadow-sm">\n            {JSON.stringify(overviewQuery.data, null, 2)}\n          </pre>\n        ) : null}\n      </section>\n    </AppLayout>\n  );\n}\n`,
);

writeNewFile(
  `apps/web/src/features/${moduleId}/hooks/${hookName}.ts`,
  `import { useQuery } from "@tanstack/react-query";\nimport { get${pascalName}Overview } from "@/api/${moduleId}";\n\nexport function ${hookName}() {\n  return useQuery({\n    queryKey: ["${moduleId}", "overview"],\n    queryFn: get${pascalName}Overview,\n  });\n}\n`,
);

writeNewFile(
  `apps/web/src/api/${moduleId}.ts`,
  `import { apiClient } from "./client";\n\nexport async function get${pascalName}Overview() {\n  return apiClient.get<unknown>("/${moduleId}");\n}\n`,
);

console.log('\nNext steps:');
console.log(`1. Add contracts/API implementation for ${moduleId} when needed.`);
console.log('2. Register the module in apps/web/src/app/navigation/modules.ts.');
console.log('3. Add permission keys if the module should be protected.');
console.log('\nRegistry snippet:');
console.log(`import { ${pageName} } from "@/modules/${moduleId}/pages/${pageName}";`);
console.log(`// route: ${camelName}: "/${moduleId}"`);
