/*
  Warnings:

  - A unique constraint covering the columns `[hotelNo]` on the table `Hotel` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Hotel" ADD COLUMN     "hotelNo" SERIAL;

-- CreateIndex
CREATE UNIQUE INDEX "Hotel_hotelNo_key" ON "Hotel"("hotelNo");
