import { Prisma } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { assertSafeIntegrationTestDatabaseUrl } from '../setup/test-database-url';
import { runPinnedPnpm } from '../setup/run-pinned-pnpm';

let migrationPreparationPromise: Promise<void> | null = null;

function assertSafeTestDatabase(): void {
  const databaseUrl = process.env.DATABASE_URL;

  assertSafeIntegrationTestDatabaseUrl(databaseUrl, 'DATABASE_URL');
}

function isMissingTableError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2021'
  );
}

async function ensureDatabasePrepared(): Promise<void> {
  if (!migrationPreparationPromise) {
    migrationPreparationPromise = Promise.resolve().then(() => {
      runPinnedPnpm(
        ['prisma', 'migrate', 'deploy', '--config', 'prisma.config.ts'],
        {
          cwd: process.cwd(),
          env: process.env,
          stdio: 'pipe',
        },
      );
    });
  }

  await migrationPreparationPromise;
}

export async function resetDatabase(prisma: PrismaService): Promise<void> {
  assertSafeTestDatabase();

  try {
    await prisma.user.deleteMany();
  } catch (error) {
    if (!isMissingTableError(error)) {
      throw error;
    }

    await ensureDatabasePrepared();
    await prisma.user.deleteMany();
  }
}
