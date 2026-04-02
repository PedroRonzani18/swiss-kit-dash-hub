import { spawnSync } from "node:child_process";

const scriptName = process.argv[2];

if (!scriptName) {
  console.error("Missing script name. Example: node scripts/run-web-workspace.mjs dev");
  process.exit(1);
}

const userAgent = process.env.npm_config_user_agent ?? "";
const isPnpm = userAgent.startsWith("pnpm/");

const command = isPnpm ? "pnpm" : "npm";
const args = isPnpm
  ? ["--filter", "./apps/web", "run", scriptName]
  : ["run", scriptName, "--workspace=apps/web"];

const result = spawnSync(command, args, { stdio: "inherit" });

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
