import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import duration from "dayjs/plugin/duration";

dayjs.extend(customParseFormat);
dayjs.extend(duration);

export function getPrettyDuration(duration: string | undefined) {
  const convertedTime = dayjs(duration, "HH:mm:ss");

  // if you have time in seconds, then return that duration
  if (!convertedTime.isValid()) {
    const durationAsNumber = Number(duration);
    return dayjs.duration(
      Number.isNaN(durationAsNumber) ? 0 : durationAsNumber,
      "second",
    );
  }

  return dayjs.duration({
    hours: convertedTime.hour(),
    minutes: convertedTime.minute(),
    seconds: convertedTime.second(),
  });
}

export function niceTime(duration: duration.Duration) {
  const hours = duration.get("h");
  const minutes = duration.get("m");
  const hourString = hours
    ? `${duration.get("h")} hour${hours > 1 ? "s" : ""}`
    : "";
  const minuteString = minutes
    ? `${duration.get("m")} minute${minutes > 1 ? "s" : ""} `
    : "";

  if (hourString && !minuteString) {
    return hourString;
  }

  if (hourString && minuteString) {
    return `${hourString}, ${minuteString}`;
  }

  if (minuteString) {
    return minuteString;
  }

  return null;
}
