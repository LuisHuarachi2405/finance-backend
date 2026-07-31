-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('BANK_ACCOUNT', 'CASH', 'DIGITAL_WALLET');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('ACTIVE', 'ARCHIVED');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "institution" TEXT,
    "accountType" "AccountType" NOT NULL,
    "currency" TEXT NOT NULL,
    "initialBalance" DECIMAL(14,2) NOT NULL,
    "status" "AccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
