import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { updateFeedItemPlayback } from "../actions/feed";
import { getAudioPlayer } from "../actions/audio";

// how to deal with hours?
function getSecondsToTimeStr(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secondsAfterMinute = Math.floor(seconds) % 60;

  return `${minutes}:${secondsAfterMinute < 10 ? "0" + secondsAfterMinute : secondsAfterMinute}`;
}

@customElement("sp-mobile-audio-player")
export class SpMobileAudioPlayer extends LitElement {
  static styles = css`
    :host {
      position: fixed;
      display: block;
      bottom: 60px;
      z-index: 2;
      width: 100%;
      max-width: 50rem;
    }

    .container {
      width: 90%;
      background: white;
      margin: 0 auto;
      border-radius: 2px;
      border: 2px solid black;
      padding-top: 0.5rem;
      padding-right: 0.5rem;
      padding-left: 0.5rem;
    }

    .info {
      display: flex;
    }

    .show-title {
      font-size: 12px;
      margin: 0;
    }

    .audio-info-control {
      margin-left: 0.25rem;
      display: flex;
      gap: 0.5rem;
      flex-grow: 1;
      justify-content: space-between;
    }

    .title {
      font-size: 12px;
      margin: 0;
    }

    .progress-container {
      margin-top: 0.25rem;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .progress-container > time {
      font-size: 0.5rem;
    }

    progress {
      flex-grow: 1;
    }
  `;

  @property({ attribute: "url" })
  url!: string;

  @property({ attribute: "title" })
  title!: string;

  @property({ attribute: "show-name" })
  showName!: string;

  @property({ attribute: "img-src" })
  imgSrc!: string;

  @state()
  _currentTime: number = -1;

  @state()
  _duration: number = -1;

  @state()
  _paused: boolean = getAudioPlayer()?.paused ?? false;

  private _togglePlay = () => {
    const audioPlayer = getAudioPlayer();

    if (audioPlayer) {
      if (audioPlayer.paused) {
        audioPlayer.play();
      } else {
        audioPlayer.pause();
      }
    }
  };

  private _handlePause = () => {
    this._paused = true;
  };

  private _handlePlay = () => {
    this._paused = false;
  };

  private _handleTimeUpdate = (e: Event) => {
    if (e.target instanceof HTMLAudioElement) {
      // don't know when to save, but this seems reasonable
      if (Math.floor(this._currentTime) !== Math.floor(e.target.currentTime)) {
        void updateFeedItemPlayback({
          url: e.target.src,
          played: false,
          currentTime: e.target.currentTime,
        });
      }
      this._currentTime = e.target.currentTime;
    }
  };

  private _handleDurationChange = (e: Event) => {
    if (e.target instanceof HTMLAudioElement) {
      this._duration = e.target.duration;
    }
  };

  private _handleEnded = (e: Event) => {
    if (e.target instanceof HTMLAudioElement) {
      void updateFeedItemPlayback({
        url: e.target.src,
        played: true,
        currentTime: this._currentTime,
      });
    }
  };

  connectedCallback() {
    super.connectedCallback();
    const audioPlayer = getAudioPlayer();
    if (audioPlayer) {
      audioPlayer.addEventListener("pause", this._handlePause);
      audioPlayer.addEventListener("play", this._handlePlay);
      audioPlayer.addEventListener("timeupdate", this._handleTimeUpdate);
      audioPlayer.addEventListener(
        "durationchange",
        this._handleDurationChange,
      );
      audioPlayer.addEventListener("ended", this._handleEnded);

      this._currentTime = audioPlayer.currentTime;
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    const audioPlayer = getAudioPlayer();
    if (audioPlayer) {
      audioPlayer.removeEventListener("pause", this._handlePause);
      audioPlayer.removeEventListener("play", this._handlePlay);
      audioPlayer.removeEventListener("timeupdate", this._handleTimeUpdate);
      audioPlayer.removeEventListener(
        "durationchange",
        this._handleDurationChange,
      );
      audioPlayer.removeEventListener("ended", this._handleEnded);
    }
  }

  render() {
    const secondsPlayed = Math.floor(this._currentTime);
    const totalSeconds = Math.floor(this._duration);
    const secondsLeft = totalSeconds - secondsPlayed;
    return html`
      <div class="container">
        <div class="info">
          <img height="50" width="50" src=${this.imgSrc} />
          <div class="audio-info-control">
            <div>
              <p class="show-title">${this.title}</p>
              <p class="title">${this.showName}</p>
            </div>
            <button id="play-pause-control" @click=${this._togglePlay}>
              ${this._paused ? "staht" : "stahp"}
            </button>
          </div>
        </div>
        <div class="progress-container">
          <time>${getSecondsToTimeStr(secondsPlayed)}</time>
          <progress .max=${totalSeconds} .value=${secondsPlayed}>
            ${this._currentTime}
          </progress>
          <time>-${getSecondsToTimeStr(secondsLeft)}</time>
        </div>
      </div>
    `;
  }
}
