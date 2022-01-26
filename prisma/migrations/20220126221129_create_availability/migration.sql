-- CreateTable
CREATE TABLE "Availability" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "startTime" TIME NOT NULL,
    "endTime" TIME NOT NULL,
    "timeZone" TEXT NOT NULL DEFAULT E'America/New_York',

    CONSTRAINT "Availability_pkey" PRIMARY KEY ("id")
);
