import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WEB_ROOT = path.resolve(__dirname, "..");
const SRC_ROOT = path.join(WEB_ROOT, "src");
const PACKAGE_JSON_PATH = path.join(WEB_ROOT, "package.json");
const DOC_PATH = path.join(WEB_ROOT, "docs", "ui-dependency-audit.md");

const args = new Set(process.argv.slice(2));
const shouldWrite = args.has("--write");
const shouldCheck = args.has("--check") || !shouldWrite;

const KNOWN_UI_DEPENDENCIES = new Set([
  "cmdk",
  "embla-carousel-react",
  "input-otp",
  "next-themes",
  "react-resizable-panels",
  "recharts",
  "sonner",
  "vaul",
]);

function isUiDependency(name) {
  return name.startsWith("@radix-ui/") || KNOWN_UI_DEPENDENCIES.has(name);
}

function listSourceFiles(directory) {
  const collected = [];

  function walk(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        if (entry.name === "__tests__") {
          continue;
        }

        walk(fullPath);
        continue;
      }

      if (!entry.isFile()) {
        continue;
      }

      if (!/\.(ts|tsx|mts|cts|js|jsx|mjs|cjs)$/.test(entry.name)) {
        continue;
      }

      if (/\.(test|spec)\./.test(entry.name)) {
        continue;
      }

      collected.push(fullPath);
    }
  }

  walk(directory);
  return collected.sort((a, b) => a.localeCompare(b));
}

function extractImports(sourceCode) {
  const imports = [];
  const patterns = [
    /\bimport\s+[^"']*?from\s*["']([^"']+)["']/g,
    /\bimport\s*["']([^"']+)["']/g,
    /\bexport\s+[^"']*?from\s*["']([^"']+)["']/g,
    /\bimport\s*\(\s*["']([^"']+)["']\s*\)/g,
  ];

  for (const pattern of patterns) {
    for (const match of sourceCode.matchAll(pattern)) {
      if (match[1]) {
        imports.push(match[1]);
      }
    }
  }

  return imports;
}

function resolveLocalImport(sourceFilePath, importPath) {
  let candidateBase;

  if (importPath.startsWith("@/")) {
    candidateBase = path.join(SRC_ROOT, importPath.slice(2));
  } else if (importPath.startsWith("./") || importPath.startsWith("../")) {
    candidateBase = path.resolve(path.dirname(sourceFilePath), importPath);
  } else {
    return null;
  }

  const extensions = ["", ".ts", ".tsx", ".mts", ".cts", ".js", ".jsx", ".mjs", ".cjs"];

  for (const ext of extensions) {
    const fileCandidate = `${candidateBase}${ext}`;
    if (fs.existsSync(fileCandidate) && fs.statSync(fileCandidate).isFile()) {
      return path.resolve(fileCandidate);
    }
  }

  if (fs.existsSync(candidateBase) && fs.statSync(candidateBase).isDirectory()) {
    for (const ext of extensions.slice(1)) {
      const indexCandidate = path.join(candidateBase, `index${ext}`);
      if (fs.existsSync(indexCandidate) && fs.statSync(indexCandidate).isFile()) {
        return path.resolve(indexCandidate);
      }
    }
  }

  return null;
}

function getEntryPoints() {
  const candidates = [
    path.join(SRC_ROOT, "main.tsx"),
    path.join(SRC_ROOT, "main.ts"),
    path.join(SRC_ROOT, "main.jsx"),
    path.join(SRC_ROOT, "main.js"),
  ];

  return candidates.filter((candidate) => fs.existsSync(candidate));
}

function getReachableFiles(importGraph, entryPoints) {
  const reachable = new Set();
  const stack = [...entryPoints];

  while (stack.length > 0) {
    const current = stack.pop();

    if (!current || reachable.has(current)) {
      continue;
    }

    reachable.add(current);

    const children = importGraph.get(current) || [];
    for (const child of children) {
      if (!reachable.has(child)) {
        stack.push(child);
      }
    }
  }

  return reachable;
}

function countDependencyHits(importsByFile, dependencies, reachableFiles) {
  const hitMap = new Map();

  for (const dependency of dependencies) {
    hitMap.set(dependency, {
      directHits: 0,
      runtimeHits: 0,
    });
  }

  for (const [filePath, importSources] of importsByFile.entries()) {
    const isReachable = reachableFiles.has(filePath);

    for (const importSource of importSources) {
      for (const dependency of dependencies) {
        if (
          importSource === dependency ||
          importSource.startsWith(`${dependency}/`)
        ) {
          const current = hitMap.get(dependency);
          if (!current) {
            continue;
          }

          current.directHits += 1;
          if (isReachable) {
            current.runtimeHits += 1;
          }
        }
      }
    }
  }

  return hitMap;
}

function formatMarkdown(dependencies, hitMap, unreachableDependencies) {
  const rows = dependencies
    .map((dependency) => {
      const hit = hitMap.get(dependency);
      return `| \`${dependency}\` | ${hit?.directHits ?? 0} | ${hit?.runtimeHits ?? 0} |`;
    })
    .join("\n");

  const unreachableSection =
    unreachableDependencies.length === 0
      ? "All audited UI dependencies are reachable from runtime entrypoints."
      : unreachableDependencies
          .map((dependency) => `- \`${dependency}\` (runtime hits: 0)`)
          .join("\n");

  return `# UI Dependency Audit\n\nThis report is generated by \`pnpm --filter web ui-deps:audit:update\`.\n\n## Snapshot\n\n- Scope: dependencies in \`apps/web/package.json\` that are UI-focused\n- Runtime entrypoint(s): \`src/main.tsx\` (fallback: \`main.ts\`, \`main.jsx\`, \`main.js\`)\n- Runtime hit means the dependency is imported from a file reachable from app entrypoint import graph\n\n## Findings\n\n| Dependency | Direct Import Hits | Runtime-Reachable Hits |\n| --- | ---: | ---: |\n${rows}\n\n## Runtime-Unreachable Dependencies\n\n${unreachableSection}\n\n## Recommended cleanup strategy\n\n1. Prefer removing runtime-unreachable UI dependencies first.\n2. If a dependency is intentional but currently unused, document the reason in this file.\n3. Keep one toast system (\`sonner\` or Radix toast wrappers), unless there is a clear migration plan.\n4. Keep this report in sync via CI check (\`pnpm --filter web ui-deps:audit\`).\n`;
}

function main() {
  const packageJson = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, "utf8"));
  const dependencies = Object.keys(packageJson.dependencies ?? {})
    .filter(isUiDependency)
    .sort((a, b) => a.localeCompare(b));

  const sourceFiles = listSourceFiles(SRC_ROOT);
  const importsByFile = new Map();
  const importGraph = new Map();

  for (const sourceFile of sourceFiles) {
    const sourceCode = fs.readFileSync(sourceFile, "utf8");
    const imports = extractImports(sourceCode);
    importsByFile.set(sourceFile, imports);

    const localImports = [];
    for (const importSource of imports) {
      const resolved = resolveLocalImport(sourceFile, importSource);
      if (resolved) {
        localImports.push(resolved);
      }
    }

    importGraph.set(sourceFile, localImports);
  }

  const entryPoints = getEntryPoints();
  if (entryPoints.length === 0) {
    console.error("No app entrypoint found in src/main.(ts|tsx|js|jsx)");
    process.exit(1);
  }

  const reachableFiles = getReachableFiles(importGraph, entryPoints);
  const hitMap = countDependencyHits(importsByFile, dependencies, reachableFiles);

  const unreachableDependencies = dependencies.filter((dependency) => {
    const hit = hitMap.get(dependency);
    return !hit || hit.runtimeHits === 0;
  });

  const markdown = formatMarkdown(dependencies, hitMap, unreachableDependencies);

  if (shouldWrite) {
    fs.writeFileSync(DOC_PATH, markdown, "utf8");
    console.log(`UI dependency audit updated: ${path.relative(WEB_ROOT, DOC_PATH)}`);
  }

  if (shouldCheck) {
    if (!fs.existsSync(DOC_PATH)) {
      console.error("Audit file not found. Run: pnpm --filter web ui-deps:audit:update");
      process.exit(1);
    }

    const current = fs.readFileSync(DOC_PATH, "utf8");
    if (current !== markdown) {
      console.error("UI dependency audit is outdated.");
      console.error("Run: pnpm --filter web ui-deps:audit:update");
      process.exit(1);
    }

    console.log("UI dependency audit is up-to-date.");
  }
}

main();
