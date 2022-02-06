import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
import { areIntervalsOverlapping } from "date-fns";
import { Request, Response } from "express";
import { getUtcDate, setDateHours } from "../utils/date";

export class CalendsoAvailabilityController {
  constructor(private readonly prismaClient: PrismaClient) {}

  async save(request: Request, response: Response): Promise<Response> {
    const { startTime, endTime, timeZone } = request.body;

    const existingAvailability =
      await this.prismaClient.availability.findFirst();

    let availability;

    /**
     *  save this way, without converting. It will never get startTime
     *  or endTime in different dates and also startTime < endTime
     */

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

      return response.json(availability);
    }
  }

  async find(request: Request, response: Response): Promise<Response> {
    const timeZone = (request.query.timeZone ?? "America/Sao_Paulo") as string;
    const date = (request.query.date ?? dayjs().format("YYYY-MM-DD")) as string;

    const availability = await this.prismaClient.availability.findFirst();

    if (!availability) {
      return response.status(400).json({ message: "There is no availability" });
    }

    const startTimeTz = setDateHours(date, availability.startTime);
    const endTimeTz = setDateHours(date, availability.endTime);

    const startTime = getUtcDate(startTimeTz, timeZone);
    const endTime = getUtcDate(endTimeTz, timeZone);

    return response.json({
      startTime,
      endTime,
      timeZone,
    });
  }

  async openings(request: Request, response: Response): Promise<Response> {
    const timeZone = (request.query.timeZone ?? "America/Sao_Paulo") as string;
    const date = (request.query.date ?? dayjs().format("YYYY-MM-DD")) as string;

    const availability = await this.prismaClient.availability.findFirst();

    if (!availability) {
      return response.status(400).json({ message: "There is no availability" });
    }

    const endTimeUtc = getUtcDate(
      setDateHours(date, availability.endTime),
      timeZone
    );

    let startTimeUtc = getUtcDate(
      setDateHours(date, availability.startTime),
      timeZone
    );

    const bookings = await this.prismaClient.booking.findMany({
      where: {
        startTime: {
          gte: dayjs(date).startOf("day").toDate(),
        },
      },
    });

    const openings = [];

    while (dayjs(startTimeUtc).isBefore(endTimeUtc)) {
      const endTime = dayjs(startTimeUtc).add(30, "minutes").toDate();

      const hasOverlap = bookings.some((booking) =>
        areIntervalsOverlapping(
          {
            start: booking.startTime,
            end: booking.endTime,
          },
          {
            start: startTimeUtc,
            end: endTimeUtc,
          }
        )
      );

      if (!hasOverlap) {
        openings.push({
          startTime: startTimeUtc,
          endTime,
        });
      }

      startTimeUtc = dayjs(startTimeUtc).add(30, "minutes").toDate();
    }

    return response.json(openings);
  }
}
