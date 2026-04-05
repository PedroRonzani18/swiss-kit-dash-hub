import 'dotenv/config';
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to run prisma seed");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: databaseUrl,
  }),
});

const PRIMARY_ALLOWED_EMAIL = "pedroaugustogabironzani@gmail.com";

async function main() {
  await prisma.allowedEmail.upsert({
    where: { email: PRIMARY_ALLOWED_EMAIL },
    update: {
      isActive: true,
      note: "Primary owner access",
    },
    create: {
      email: PRIMARY_ALLOWED_EMAIL,
      isActive: true,
      note: "Primary owner access",
    },
  });

  const user = await prisma.user.upsert({
    where: { email: "demo@swisskit.app" },
    update: {},
    create: {
      email: "demo@swisskit.app",
      name: "Demo User",
      provider: "google",
      providerUserId: "demo-google-user-id",
    },
  });

  await prisma.account.upsert({
    where: {
      userId_name: {
        userId: user.id,
        name: "Main account",
      },
    },
    update: {},
    create: {
      userId: user.id,
      name: "Main account",
      type: "checking",
      currency: "BRL",
      openingBalanceCents: 0,
      institution: "Demo Bank",
    },
  });

  await prisma.category.upsert({
    where: {
      userId_name_type: {
        userId: user.id,
        name: "General",
        type: "expense",
      },
    },
    update: {},
    create: {
      userId: user.id,
      name: "General",
      type: "expense",
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
