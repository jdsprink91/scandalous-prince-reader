import { html, LitElement } from "lit";
import { state } from "lit/decorators.js";
import { getAudioPlayer } from "../actions/audio";
import { niceTime } from "../utils/date";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import duration from "dayjs/plugin/duration";

dayjs.extend(customParseFormat);
dayjs.extend(duration);

export class AudioIntegratedElement extends LitElement {
  @state()
  playing: boolean = false;

  @state()
  currentTime: number | undefined = undefined;

  @state()
  ended: boolean = false;

  protected _handlePlay = () => {
    this.playing = true;
  };

  protected _handlePause = () => {
    this.playing = false;
  };

  protected _handleTimeUpdate = (e: Event) => {
    if (e.target instanceof HTMLAudioElement) {
      // don't know when to save, but this seems reasonable
      this.currentTime = e.target.currentTime;
    }
  };

  protected _handleEnded = () => {
    this.ended = true;
  };

  protected _addEventListeners = () => {
    const audioPlayer = getAudioPlayer();
    audioPlayer.addEventListener("play", this._handlePlay);
    audioPlayer.addEventListener("pause", this._handlePause);
    audioPlayer.addEventListener("timeupdate", this._handleTimeUpdate);
    audioPlayer.addEventListener("ended", this._handleEnded);
  };

  protected _removeEventListeners = () => {
    const audioPlayer = getAudioPlayer();
    audioPlayer.removeEventListener("play", this._handlePlay);
    audioPlayer.removeEventListener("pause", this._handlePause);
    audioPlayer.removeEventListener("timeupdate", this._handleTimeUpdate);
    audioPlayer.removeEventListener("ended", this._handleEnded);
  };

  protected _renderDuration = (duration: string | undefined) => {
    if (duration === undefined) {
      return html`No duration info`;
    }

    const convertedTime = dayjs(duration, "HH:mm:ss");

    let durationObj = dayjs.duration({
      hours: convertedTime.hour(),
      minutes: convertedTime.minute(),
      seconds: convertedTime.second(),
    });

    // if you have time in seconds, then return that duration
    if (!convertedTime.isValid()) {
      const durationAsNumber = Number(duration);
      durationObj = dayjs.duration(
        Number.isNaN(durationAsNumber) ? 0 : durationAsNumber,
        "second",
      );
    }

    if (this.ended) {
      return html`
        <time .datetime=${duration}>${niceTime(durationObj)}</time>
        <p class="time-modifier">Played!</p>
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

    return html`<time .datetime=${duration}>${niceTime(durationObj)}</time>`;
  };
}
