import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";

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
  _paused: boolean = false;

  @state()
  _duration: number = 0;

  @state()
  _currentTime: number = 0;

  private _getAudioPlayer() {
    return document.querySelector<HTMLAudioElement>("#my-audio");
  }

  private _togglePlay() {
    const audioPlayer = this._getAudioPlayer();

    if (audioPlayer) {
      if (audioPlayer.paused) {
        audioPlayer.play();
      } else {
        audioPlayer.pause();
      }
    }
  }

  connectedCallback() {
    super.connectedCallback();
    const audioPlayer = this._getAudioPlayer();
    if (audioPlayer) {
      audioPlayer.addEventListener("pause", () => {
        this._paused = true;
      });

      audioPlayer.addEventListener("play", () => {
        this._paused = false;
      });

      audioPlayer.addEventListener("timeupdate", (e) => {
        if (e.target instanceof HTMLAudioElement) {
          this._currentTime = e.target.currentTime;
        }
      });

      audioPlayer.addEventListener("durationchange", (e) => {
        if (e.target instanceof HTMLAudioElement) {
          this._duration = e.target.duration;
        }
      });
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
          <progress .max=${this._duration} .value=${this._currentTime}>
            ${this._currentTime}
          </progress>
          <time>-${getSecondsToTimeStr(secondsLeft)}</time>
        </div>
      </div>
    `;
  }
}
