import { Booking } from "@prisma/client";
import { Router } from "express";
import { CalendsoAvailabilityController } from "../controllers/calendso-availability";
import { DatabaseAvailabilityController } from "../controllers/database-availability";
import { connection } from "../database/knex";
import { prismaClient } from "../database/prisma";

const routes = Router();

const calendsoAvailabilityController = new CalendsoAvailabilityController(
  prismaClient
);

const databaseAvailabilityController = new DatabaseAvailabilityController(
  connection
);

routes.get(
  "/calendso/availability",
  calendsoAvailabilityController.find.bind(calendsoAvailabilityController)
);

routes.post(
  "/calendso/availability",
  calendsoAvailabilityController.save.bind(calendsoAvailabilityController)
);

routes.get(
  "/database/availability",
  databaseAvailabilityController.find.bind(databaseAvailabilityController)
);

routes.post(
  "/database/availability",
  databaseAvailabilityController.save.bind(databaseAvailabilityController)
);

routes.post("/bookings", async (request, response) => {
  const { startTime, endTime } = request.body;

  const existingBooking = await prismaClient.booking.findFirst();

  let booking: Booking;

  if (!existingBooking) {
    booking = await prismaClient.booking.create({
      data: {
        startTime,
        endTime,
      },
    });

    return response.status(201).json(booking);
  } else {
    booking = await prismaClient.booking.update({
      where: {
        id: existingBooking.id,
      },
      data: {
        startTime,
        endTime,
      },
    });

    return response.json(booking);
  }
});

export { routes };
