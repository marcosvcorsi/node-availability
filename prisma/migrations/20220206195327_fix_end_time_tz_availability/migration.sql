/*
  Warnings:

  - You are about to drop the column `endTImeTz` on the `Availability` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Availability" DROP COLUMN "endTImeTz",
ADD COLUMN     "endTimeTz" TIMETZ;
