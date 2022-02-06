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
    const { startTimeTz, endTimeTz, timeZone } = request.body;

    const existingAvailability = await this.connection("Availability").first();

    const data = {
      startTimeTz: dayjs(getUtcDate(new Date(startTimeTz), timeZone)).format(
        "HH:mm:ss"
      ),
      endTimeTz: dayjs(getUtcDate(new Date(endTimeTz), timeZone)).format(
        "HH:mm:ss"
      ),
      timeZone,
    };

    if (!existingAvailability) {
      const results = await this.connection()
        .insert(data)
        .into("Availability")
        .returning("*");

      return response.status(201).json(results[0]);
    } else {
      const results = await this.connection("Availability")
        .where({ id: existingAvailability.id })
        .update(data)
        .returning("*");

      return response.json(results[0]);
    }
  }

  async find(request: Request, response: Response): Promise<Response> {
    const timeZone = (request.query.timeZone ?? "America/Sao_Paulo") as string;
    const date = (request.query.date ?? dayjs().format("YYYY-MM-DD")) as string;

    const availability = await this.connection("Availability")
      .select("startTimeTz", "endTimeTz", "timeZone")
      .first();

    if (!availability) {
      return response.status(400).json({ message: "There is no availability" });
    }

    return response.json({
      startTimeTz: dayjs(`${date} ${availability.startTimeTz}`).toDate(),
      endTimeTz: dayjs(`${date} ${availability.endTimeTz}`).toDate(),
      timeZone,
    });
  }
}
