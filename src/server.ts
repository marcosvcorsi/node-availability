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

const setDateHours = (dateString: string, dateTime: Date): Date => {
  return dayjs(dateString)
    .set("hour", dateTime.getHours())
    .set("minute", dateTime.getMinutes())
    .toDate();
};

const getUtcDate = (date: Date, timeZone: string): Date => {
  const utcOffset = dayjs().tz(timeZone).utcOffset();

  const minutes =
    dayjs.utc(date).get("hours") * 60 +
    dayjs.utc(date).get("minutes") -
    utcOffset;

  return dayjs.utc(date).startOf("day").add(minutes, "minute").toDate();
};

app.get("/", async (req, res) => {
  const timeZone = (req.query.timeZone ?? "America/New_York") as string;
  const date = (req.query.date ?? "2022-01-28") as string;

  const availability = await prismaClient.availability.findFirst();

  if (!availability) {
    return res.status(400).json({ message: "There is no availability" });
  }

  const startTime = setDateHours(date, availability.startTime);
  const endTime = setDateHours(date, availability.endTime);

  const startTimeUtc = getUtcDate(startTime, timeZone);
  const endTimeUtc = getUtcDate(endTime, timeZone);

  return res.json({
    startTime,
    endTime,
    timeZone,
    startTimeUtc,
    endTimeUtc,
  });
});

app.listen(3000, () => console.log("Server is running"));
