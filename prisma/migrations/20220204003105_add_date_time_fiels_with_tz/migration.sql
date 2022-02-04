/*
  Warnings:

  - You are about to drop the column `date` on the `Availability` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Availability" DROP COLUMN "date",
ADD COLUMN     "endDateTime" TIMESTAMPTZ,
ADD COLUMN     "startDateTime" TIMESTAMPTZ;
