import { execFileSync } from 'node:child_process';

const PINNED_PNPM = 'pnpm@10.33.0';

export function runPinnedPnpm(
  args: string[],
  options: Parameters<typeof execFileSync>[2],
): void {
  execFileSync('corepack', [PINNED_PNPM, ...args], options);
}
