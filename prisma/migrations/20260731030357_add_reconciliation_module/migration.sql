-- CreateEnum
CREATE TYPE "ReconciliationStatus" AS ENUM ('MATCHED', 'UNMATCHED', 'IGNORED');

-- CreateTable
CREATE TABLE "ReconciliationMatch" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "transactionId" TEXT,
    "importedTransactionId" TEXT NOT NULL,
    "matchScore" DOUBLE PRECISION,
    "status" "ReconciliationStatus" NOT NULL,
    "reviewedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReconciliationMatch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ReconciliationMatch_userId_idx" ON "ReconciliationMatch"("userId");

-- CreateIndex
CREATE INDEX "ReconciliationMatch_transactionId_idx" ON "ReconciliationMatch"("transactionId");

-- CreateIndex
CREATE INDEX "ReconciliationMatch_importedTransactionId_idx" ON "ReconciliationMatch"("importedTransactionId");

-- AddForeignKey
ALTER TABLE "ReconciliationMatch" ADD CONSTRAINT "ReconciliationMatch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReconciliationMatch" ADD CONSTRAINT "ReconciliationMatch_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReconciliationMatch" ADD CONSTRAINT "ReconciliationMatch_importedTransactionId_fkey" FOREIGN KEY ("importedTransactionId") REFERENCES "ImportedTransaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
