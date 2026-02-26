/*
  Warnings:

  - Made the column `englishName` on table `Hotel` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Hotel" ADD COLUMN     "discountInfo" TEXT,
ALTER COLUMN "englishName" SET NOT NULL;
