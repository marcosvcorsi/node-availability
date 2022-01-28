import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
import dayjsUTC from "dayjs/plugin/utc";
import dayjsTimezone from "dayjs/plugin/timezone";
import dayjsAdvancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(dayjsUTC);
dayjs.extend(dayjsTimezone);
dayjs.extend(dayjsAdvancedFormat);

const app = express();

app.use(cors());
app.use(express.json());

const prismaClient = new PrismaClient();

app.post("/", async (req, res) => {
  const { startTime, endTime, timeZone } = req.body;

  const availability = await prismaClient.availability.create({
    data: {
      endTime,
      startTime,
      timeZone,
    },
  });

  return res.status(201).json(availability);
});

app.get("/", async (req, res) => {
  const timeZone = (req.query.timeZone ?? "America/New_York") as string;
  const date = (req.query.date ?? "2022-01-28") as string;

  const utcOffset = dayjs().tz(timeZone).utcOffset();

  console.log({ utcOffset, timeZone });

  const availability = await prismaClient.availability.findFirst();

  if (!availability) {
    return res.status(400).json({ message: "There is no availability" });
  }

  const startDateTime = dayjs(date)
    .set("hour", availability.startTime.getHours())
    .set("minute", availability.startTime.getMinutes())
    .toDate();

  const endDateTime = dayjs(date)
    .set("hour", availability.endTime.getHours())
    .set("minute", availability.endTime.getMinutes())
    .toDate();

  console.log({ startDateTime, endDateTime });

  const startTime = dayjs.tz(startDateTime).tz(timeZone, true).utc().format();
  const endTime = dayjs.tz(endDateTime, timeZone).utc().format();

  console.log({ startTime, endTime });

  return res.json({ startTime, endTime, timeZone });
});

app.listen(3000, () => console.log("Server is running"));
