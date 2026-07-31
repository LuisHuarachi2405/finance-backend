-- CreateEnum
CREATE TYPE "ImportReconciliationStatus" AS ENUM ('UNRECONCILED', 'RECONCILED');

-- AlterEnum
BEGIN;
CREATE TYPE "ImportProvider_new" AS ENUM ('YAPE');
ALTER TABLE "Statement" ALTER COLUMN "provider" TYPE "ImportProvider_new" USING ("provider"::text::"ImportProvider_new");
ALTER TYPE "ImportProvider" RENAME TO "ImportProvider_old";
ALTER TYPE "ImportProvider_new" RENAME TO "ImportProvider";
DROP TYPE "public"."ImportProvider_old";
COMMIT;

-- AlterTable
ALTER TABLE "ImportedTransaction" DROP COLUMN "balance",
DROP COLUMN "providerReference",
ADD COLUMN     "rawData" JSONB NOT NULL,
ADD COLUMN     "reconciliationStatus" "ImportReconciliationStatus" NOT NULL DEFAULT 'UNRECONCILED',
ADD COLUMN     "reference" TEXT;
