import { spawnSync } from "node:child_process";
import path from "node:path";

const scriptName = process.argv[2];

if (!scriptName) {
  console.error("Missing script name. Example: node scripts/run-web-workspace.mjs dev");
  process.exit(1);
}

const userAgent = process.env.npm_config_user_agent ?? "";
const isPnpm = userAgent.startsWith("pnpm/");

const command = isPnpm ? "pnpm" : "npm";
const rootViteConfigPath = path.resolve(process.cwd(), "vite.config.ts");

const viteArgsByScript = {
  dev: [],
  build: ["build"],
  "build:dev": ["build", "--mode", "development"],
  preview: ["preview"],
};

const runWithRootVite = Object.hasOwn(viteArgsByScript, scriptName);

const args = runWithRootVite
  ? isPnpm
    ? ["--filter", "./apps/web", "exec", "vite", ...viteArgsByScript[scriptName], "--config", rootViteConfigPath]
    : ["exec", "--workspace=apps/web", "--", "vite", ...viteArgsByScript[scriptName], "--config", rootViteConfigPath]
  : isPnpm
    ? ["--filter", "./apps/web", "run", scriptName]
    : ["run", scriptName, "--workspace=apps/web"];

const result = spawnSync(command, args, { stdio: "inherit" });

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
