/*
  Warnings:

  - You are about to drop the column `endDateTime` on the `Availability` table. All the data in the column will be lost.
  - You are about to drop the column `startDateTime` on the `Availability` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Availability" DROP COLUMN "endDateTime",
DROP COLUMN "startDateTime",
ADD COLUMN     "endTImeTz" TIMETZ,
ADD COLUMN     "startTimeTz" TIMETZ;

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);
