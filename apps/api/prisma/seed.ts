import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required to run prisma seed');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: databaseUrl,
  }),
});

async function main() {
  await prisma.category.upsert({
    where: { id: 'seed-category-expense' },
    update: {},
    create: {
      id: 'seed-category-expense',
      name: 'General',
      type: 'expense',
    },
  });

  await prisma.account.upsert({
    where: { id: 'seed-account-main' },
    update: {},
    create: {
      id: 'seed-account-main',
      name: 'Main account',
      type: 'checking',
      currency: 'BRL',
    },
  });
}

main()
  .catch(error => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
