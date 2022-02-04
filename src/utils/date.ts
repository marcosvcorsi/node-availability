import dayjs from "dayjs";
import dayjsUTC from "dayjs/plugin/utc";
import dayjsTimezone from "dayjs/plugin/timezone";
import dayjsAdvancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(dayjsUTC);
dayjs.extend(dayjsTimezone);
dayjs.extend(dayjsAdvancedFormat);

export const setDateHours = (dateString: string, dateTime: Date): Date => {
  return dayjs(dateString)
    .set("hour", dateTime.getHours())
    .set("minute", dateTime.getMinutes())
    .toDate();
};

export const setDate = (dateString: string, date: Date): Date => {
  return dayjs(dateString)
    .set("year", date.getFullYear())
    .set("month", date.getMonth())
    .set("date", date.getDate())
    .toDate();
};

export const getUtcDate = (date: Date, timeZone: string): Date => {
  const utcOffset = dayjs().tz(timeZone).utcOffset();

  const minutes =
    dayjs.utc(date).get("hours") * 60 +
    dayjs.utc(date).get("minutes") -
    utcOffset;

  return dayjs.utc(date).startOf("day").add(minutes, "minute").toDate();
};
