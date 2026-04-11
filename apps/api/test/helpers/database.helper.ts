import { execFileSync } from 'node:child_process';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';

let migrationPreparationPromise: Promise<void> | null = null;

function isMissingTableError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2021'
  );
}

async function ensureDatabasePrepared(): Promise<void> {
  if (!migrationPreparationPromise) {
    migrationPreparationPromise = Promise.resolve().then(() => {
      execFileSync(
        'pnpm',
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
  try {
    await prisma.transaction.deleteMany();
  } catch (error) {
    if (!isMissingTableError(error)) {
      throw error;
    }

    await ensureDatabasePrepared();
    await prisma.transaction.deleteMany();
  }

  await prisma.subcategory.deleteMany();
  await prisma.category.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  await prisma.allowedEmail.deleteMany();
}
