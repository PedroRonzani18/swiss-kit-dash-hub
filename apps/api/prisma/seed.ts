import 'dotenv/config';
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { ACCESS_CONTROL_CORE_PERMISSIONS } from "@swisskit/contracts/access-control";

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

const DEFAULT_ROLE_DEFINITIONS = [
  {
    key: "admin",
    label: "Admin",
    description: "Full administrator role for the Swiss Kit template.",
    permissionKeys: ACCESS_CONTROL_CORE_PERMISSIONS.map(
      (permission) => permission.key,
    ),
  },
  {
    key: "member",
    label: "Member",
    description: "Baseline authenticated member role for the Swiss Kit template.",
    permissionKeys: ["core:access", "settings:access"],
  },
] as const;

async function seedAllowedEmails() {
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
}

async function seedDemoUser() {
  await prisma.user.upsert({
    where: { email: "demo@swisskit.app" },
    update: {},
    create: {
      email: "demo@swisskit.app",
      name: "Demo User",
      provider: "google",
      providerUserId: "demo-google-user-id",
    },
  });
}

async function seedPermissions() {
  const permissionRows = new Map<string, { id: string }>();

  for (const permission of ACCESS_CONTROL_CORE_PERMISSIONS) {
    const row = await prisma.permission.upsert({
      where: { key: permission.key },
      update: {
        moduleId: permission.moduleId,
        action: permission.action,
        label: permission.label,
        description: permission.description,
      },
      create: {
        key: permission.key,
        moduleId: permission.moduleId,
        action: permission.action,
        label: permission.label,
        description: permission.description,
      },
      select: {
        id: true,
        key: true,
      },
    });

    permissionRows.set(row.key, { id: row.id });
  }

  return permissionRows;
}

async function seedRoles(permissionRows: Map<string, { id: string }>) {
  for (const roleDefinition of DEFAULT_ROLE_DEFINITIONS) {
    const role = await prisma.role.upsert({
      where: { key: roleDefinition.key },
      update: {
        label: roleDefinition.label,
        description: roleDefinition.description,
        isSystem: true,
      },
      create: {
        key: roleDefinition.key,
        label: roleDefinition.label,
        description: roleDefinition.description,
        isSystem: true,
      },
      select: {
        id: true,
        key: true,
      },
    });

    for (const permissionKey of roleDefinition.permissionKeys) {
      const permission = permissionRows.get(permissionKey);

      if (!permission) {
        throw new Error(
          `Permission ${permissionKey} not found while seeding role ${role.key}`,
        );
      }

      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: role.id,
          permissionId: permission.id,
        },
      });
    }
  }
}

async function main() {
  await seedAllowedEmails();
  await seedDemoUser();

  const permissionRows = await seedPermissions();
  await seedRoles(permissionRows);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
