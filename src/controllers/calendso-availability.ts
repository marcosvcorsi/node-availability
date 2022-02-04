import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
import { Request, Response } from "express";
import { getUtcDate, setDateHours } from "../utils/date";

export class CalendsoAvailabilityController {
  constructor(private readonly prismaClient: PrismaClient) {}

  async save(request: Request, response: Response): Promise<Response> {
    const { startTime, endTime, timeZone } = request.body;

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

      return response.status(200).json(availability);
    }
  }

  async find(request: Request, response: Response): Promise<Response> {
    const timeZone = (request.query.timeZone ?? "America/Sao_Paulo") as string;
    const date = (request.query.date ?? dayjs().format("YYYY-MM-DD")) as string;

    const availability = await this.prismaClient.availability.findFirst();

    if (!availability) {
      return response.status(400).json({ message: "There is no availability" });
    }

    const startTime = setDateHours(date, availability.startTime);
    const endTime = setDateHours(date, availability.endTime);

    const startTimeUtc = getUtcDate(startTime, timeZone);
    const endTimeUtc = getUtcDate(endTime, timeZone);

    return response.json({
      startTime,
      endTime,
      timeZone,
      startTimeUtc,
      endTimeUtc,
    });
  }
}
