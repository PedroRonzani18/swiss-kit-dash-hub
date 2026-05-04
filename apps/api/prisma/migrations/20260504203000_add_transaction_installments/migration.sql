ALTER TABLE "Transaction"
  ADD COLUMN "isInstallment" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "installmentNumber" INTEGER,
  ADD COLUMN "installmentTotal" INTEGER,
  ADD COLUMN "installmentGroupId" TEXT;

CREATE INDEX "Transaction_userId_installmentGroupId_idx"
  ON "Transaction"("userId", "installmentGroupId");
