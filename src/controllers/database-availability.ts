import dayjs from "dayjs";
import dayjsUtc from "dayjs/plugin/utc";
import dayjsTimezone from "dayjs/plugin/timezone";
import { Request, Response } from "express";
import { Knex } from "knex";
import { getUtcDate } from "../utils/date";

dayjs.extend(dayjsUtc);
dayjs.extend(dayjsTimezone);

export class DatabaseAvailabilityController {
  constructor(private readonly connection: Knex) {}

  async save(request: Request, response: Response): Promise<Response> {
    const { startDateTime, endDateTime, timeZone } = request.body;

    const existingAvailability = await this.connection("Availability").first();

    if (!existingAvailability) {
      const results = await this.connection()
        .insert({
          startDateTime: getUtcDate(new Date(startDateTime), timeZone),
          endDateTime: getUtcDate(new Date(endDateTime), timeZone),
          timeZone,
        })
        .into("Availability")
        .returning("*");

      return response.status(201).json(results[0]);
    } else {
      const results = await this.connection("Availability")
        .where({ id: existingAvailability.id })
        .update({
          startDateTime: dayjs(startDateTime).tz(timeZone).toDate(),
          endDateTime: dayjs(endDateTime).tz(timeZone).toDate(),
          timeZone,
        })
        .returning("*");

      return response.status(200).json(results[0]);
    }
  }

  async find(request: Request, response: Response): Promise<Response> {
    const timeZone = (request.query.timeZone ?? "America/Sao_Paulo") as string;
    const date = (request.query.date ?? dayjs().format("YYYY-MM-DD")) as string;

    const availability = await this.connection("Availability")
      .select(
        this.connection.raw(
          `"startDateTime" at time zone '${timeZone}' as "startDateTime"`
        ),
        this.connection.raw(
          `"endDateTime" at time zone '${timeZone}' as  "endDateTime"`
        )
      )
      .first();

    console.log("availability", availability);

    if (!availability) {
      return response.status(400).json({ message: "There is no availability" });
    }

    // const startDateTime = setDate(date, availability.startDateTime);
    // const endDateTime = setDate(date, availability.endDateTime);

    return response.json({
      // startDateTime: new Date(availability.startDateTime),
      // endDateTime: new Date(availability.endDateTime),

      startDateTime: dayjs.tz(availability.startDateTime, timeZone).format(),
      endDateTime: dayjs.tz(availability.endDateTime, timeZone).format(),
      timeZone,
    });
  }
}
