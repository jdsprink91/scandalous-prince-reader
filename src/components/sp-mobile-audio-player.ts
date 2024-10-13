import { css, html, LitElement } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";

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
      display: flex;
      width: 90%;
      background: white;
      margin: 0 auto;
      border-radius: 2px;
      border: 2px solid black;
    }

    .show-title {
      font-size: 12px;
      margin: 0;
    }

    .audio-info-control {
      display: flex;
      gap: 0.5rem;
      flex-grow: 1;
      justify-content: space-between;
      padding-top: 0.25rem;
      padding-bottom: 0.25rem;
      padding-right: 0.5rem;
    }

    .title {
      font-size: 12px;
      margin: 0;
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

  @query("#my-audio")
  private _audioPlayer!: HTMLAudioElement;

  @query("#play-pause-control")
  private _toggleButton!: HTMLButtonElement;

  private _togglePlay() {
    if (this._audioPlayer.paused) {
      this._audioPlayer.play();
      this._toggleButton.textContent = "stahp";
    } else {
      this._audioPlayer.pause();
      this._toggleButton.textContent = "staht";
    }
  }

  private _updateCurrentTime() {
    this._currentTime = this._audioPlayer.currentTime;
  }

  @state()
  private _currentTime: number = 0;

  render() {
    return html`
      <div class="container">
        <img height="50" width="50" src=${this.imgSrc} />
        <div class="audio-info-control">
          <div>
            <p class="show-title">${this.title}</p>
            <p class="title">${this.showName}</p>
            <p>${this._currentTime}</p>
          </div>
          <button id="play-pause-control" @click=${this._togglePlay}>
            stahp
          </button>
        </div>
        <audio
          id="my-audio"
          src=${this.url}
          preload="auto"
          autoplay
          @timeupdate=${this._updateCurrentTime}
        ></audio>
      </div>
    `;
  }
}
