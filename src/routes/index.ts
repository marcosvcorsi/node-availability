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

export { routes };
