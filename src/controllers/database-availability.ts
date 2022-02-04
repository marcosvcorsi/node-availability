import { Availability } from "@prisma/client";
import { Request, Response } from "express";
import { Knex } from "knex";
import { getUtcDate, setDate, setDateHours } from "../utils/date";

export class DatabaseAvailabilityController {
  constructor(private readonly connection: Knex) {}

  async save(request: Request, response: Response): Promise<Response> {
    const { startDateTime, endDateTime, timeZone } = request.body;

    const existingAvailability = await this.connection("Availability").first();

    if (!existingAvailability) {
      const results = await this.connection()
        .insert({
          startDateTime,
          endDateTime,
          timeZone,
        })
        .into("Availability")
        .returning("*");

      return response.status(201).json(results[0]);
    } else {
      const results = await this.connection("Availability")
        .where({ id: existingAvailability.id })
        .update({
          startDateTime,
          endDateTime,
          timeZone,
        })
        .returning("*");

      return response.status(200).json(results[0]);
    }
  }

  async find(request: Request, response: Response): Promise<Response> {
    const timeZone = (request.query.timeZone ?? "America/New_York") as string;
    const date = (request.query.date ?? "2022-01-28") as string;

    const availability = await this.connection("Availability").first();

    if (!availability) {
      return response.status(400).json({ message: "There is no availability" });
    }

    const startDateTime = setDate(date, availability.startDateTime);
    const endDateTime = setDate(date, availability.endDateTime);

    return response.json({
      startDateTime,
      endDateTime,
      timeZone,
    });
  }
}
