/*
  Warnings:

  - You are about to drop the column `originalAmount` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `originalCurrency` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Transaction` table. All the data in the column will be lost.
  - You are about to alter the column `amount` on the `Transaction` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to drop the column `balance` on the `User` table. All the data in the column will be lost.
  - Added the required column `benefitCategoryId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `merchantId` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'ELIGIBLE', 'DECLINED');

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "originalAmount",
DROP COLUMN "originalCurrency",
DROP COLUMN "type",
ADD COLUMN     "benefitCategoryId" TEXT NOT NULL,
ADD COLUMN     "merchantId" TEXT NOT NULL,
ADD COLUMN     "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "amount" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "balance";

-- DropEnum
DROP TYPE "public"."TransactionType";

-- CreateTable
CREATE TABLE "BenefitCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "annualBalance" INTEGER NOT NULL,

    CONSTRAINT "BenefitCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Balance" (
    "id" TEXT NOT NULL,
    "remainingBalance" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "benefitCategoryId" TEXT NOT NULL,

    CONSTRAINT "Balance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Merchant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Merchant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Balance_userId_benefitCategoryId_key" ON "Balance"("userId", "benefitCategoryId");

-- AddForeignKey
ALTER TABLE "Balance" ADD CONSTRAINT "Balance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Balance" ADD CONSTRAINT "Balance_benefitCategoryId_fkey" FOREIGN KEY ("benefitCategoryId") REFERENCES "BenefitCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_benefitCategoryId_fkey" FOREIGN KEY ("benefitCategoryId") REFERENCES "BenefitCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
