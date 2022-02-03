import { Availability, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { Knex } from "knex";
import { connection } from "../database/knex";
import { getUtcDate, setDateHours } from "../utils/date";

export class AvailabilityController {
  constructor(
    private readonly prismaClient: PrismaClient,
    private readonly connection: Knex
  ) {}

  async save(request: Request, response: Response): Promise<Response> {
    const { startTime, endTime, timeZone, dateWithTimeZone } = request.body;

    const existingAvailability =
      await this.prismaClient.availability.findFirst();

    let availability;

    if (!existingAvailability) {
      availability = await this.prismaClient.availability.create({
        data: {
          endTime,
          startTime,
          timeZone,
        },
      });

      await connection("Availability").where({ id: availability.id }).update({
        date: dateWithTimeZone,
      });

      return response.status(201).json(availability);
    } else {
      availability = await this.prismaClient.availability.update({
        data: {
          endTime,
          startTime,
          timeZone,
        },
        where: {
          id: existingAvailability.id,
        },
      });

      await connection("Availability").where({ id: availability.id }).update({
        date: dateWithTimeZone,
      });

      return response.status(200).json(availability);
    }
  }

  async find(request: Request, response: Response): Promise<Response> {
    const timeZone = (request.query.timeZone ?? "America/New_York") as string;
    const date = (request.query.date ?? "2022-01-28") as string;

    const availability = await this.prismaClient.availability.findFirst();

    if (!availability) {
      return response.status(400).json({ message: "There is no availability" });
    }

    const startTime = setDateHours(date, availability.startTime);
    const endTime = setDateHours(date, availability.endTime);

    const startTimeUtc = getUtcDate(startTime, timeZone);
    const endTimeUtc = getUtcDate(endTime, timeZone);

    const knexAvailability = await connection<Availability>("Availability")
      .select("date")
      .where({ id: availability.id })
      .first();

    return response.json({
      startTime,
      endTime,
      timeZone,
      startTimeUtc,
      endTimeUtc,
      datePrisma: availability.date,
      dateKnex: knexAvailability?.date,
    });
  }
}
