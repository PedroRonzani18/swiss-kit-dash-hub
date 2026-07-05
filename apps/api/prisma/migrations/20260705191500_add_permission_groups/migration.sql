-- CreateTable
CREATE TABLE "PermissionGroup" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PermissionGroup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PermissionGroup_key_key" ON "PermissionGroup"("key");

-- CreateIndex
CREATE INDEX "PermissionGroup_sortOrder_idx" ON "PermissionGroup"("sortOrder");

-- AlterTable
ALTER TABLE "Permission" ADD COLUMN "groupId" TEXT;

-- Backfill groups from existing module ids
INSERT INTO "PermissionGroup" ("id", "key", "label", "description", "sortOrder", "createdAt", "updatedAt")
SELECT
    'group.' || "moduleId",
    "moduleId",
    INITCAP(REPLACE("moduleId", '-', ' ')),
    NULL,
    ROW_NUMBER() OVER (ORDER BY "moduleId") * 10,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM (
    SELECT DISTINCT "moduleId"
    FROM "Permission"
) AS "module_groups"
ON CONFLICT ("key") DO NOTHING;

-- Backfill permission group relation
UPDATE "Permission" AS "permission"
SET "groupId" = "group"."id"
FROM "PermissionGroup" AS "group"
WHERE "group"."key" = "permission"."moduleId"
  AND "permission"."groupId" IS NULL;

-- AlterTable
ALTER TABLE "Permission" ALTER COLUMN "groupId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Permission_groupId_idx" ON "Permission"("groupId");

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "PermissionGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
