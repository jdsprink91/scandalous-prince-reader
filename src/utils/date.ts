import duration from "dayjs/plugin/duration";

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
