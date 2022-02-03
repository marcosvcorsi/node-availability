import { Router } from "express";
import { AvailabilityController } from "../controllers/availability";
import { connection } from "../database/knex";
import { prismaClient } from "../database/prisma";

const routes = Router();

const availabilityController = new AvailabilityController(
  prismaClient,
  connection
);

routes.get(
  "/availability",
  availabilityController.find.bind(availabilityController)
);

routes.post(
  "/availability",
  availabilityController.save.bind(availabilityController)
);

export { routes };
