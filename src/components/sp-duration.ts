import dayjs from "dayjs";
import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import customParseFormat from "dayjs/plugin/customParseFormat";
import duration from "dayjs/plugin/duration";

dayjs.extend(customParseFormat);
dayjs.extend(duration);

function niceTime(duration: duration.Duration) {
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

@customElement("sp-duration")
export class SpDuration extends LitElement {
  static styles = css`
    :host {
      display: flex;
      align-items: center;
    }

    .time-modifier {
      margin-top: 0px;
      margin-bottom: 0px;
      margin-left: 0.25rem;
    }
  `;
  @property({ type: String })
  duration: string | null = null;

  @property({ type: Boolean })
  ended: boolean = false;

  @property({ type: Number })
  currentTime: number | null = null;

  render() {
    if (this.duration === null || this.duration === "") {
      return html`No duration info`;
    }

    let convertedTime = dayjs(this.duration, "HH:mm:ss");
    // might
    if (!convertedTime.isValid()) {
      convertedTime = dayjs(this.duration, "mm:ss");
    }

    let durationObj = dayjs.duration({
      hours: convertedTime.hour(),
      minutes: convertedTime.minute(),
      seconds: convertedTime.second(),
    });

    // if you have time in seconds, then return that duration
    if (!convertedTime.isValid()) {
      const durationAsNumber = Number(this.duration);
      durationObj = dayjs.duration(
        Number.isNaN(durationAsNumber) ? 0 : durationAsNumber,
        "second",
      );
    }

    if (this.ended) {
      return html`
        <time .datetime=${this.duration}>${niceTime(durationObj)}</time>
        <p class="time-modifier">played!</p>
      `;
    }

    if (this.currentTime) {
      const timePlayed = Math.floor(this.currentTime);
      const timeLeft = durationObj.subtract({ seconds: timePlayed });

      return html`
        <time .datetime=${timeLeft.format("HH:mm:ss")}
          >${niceTime(timeLeft)}</time
        >
        <p class="time-modifier">remaining</p>
      `;
    }

    return html`<time .datetime=${this.duration}
      >${niceTime(durationObj)}</time
    >`;
  }
}
