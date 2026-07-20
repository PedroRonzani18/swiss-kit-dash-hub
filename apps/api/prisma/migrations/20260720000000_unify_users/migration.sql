-- This repository currently uses an empty local database. This migration is an
-- intentional destructive cutover from the legacy access-list model.
ALTER TABLE "User"
  ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "note" TEXT,
  ALTER COLUMN "provider" DROP NOT NULL,
  ALTER COLUMN "provider" DROP DEFAULT,
  ALTER COLUMN "providerUserId" DROP NOT NULL;

CREATE INDEX "User_isActive_idx" ON "User"("isActive");

DROP TABLE "AllowedEmail";
