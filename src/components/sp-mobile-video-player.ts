import { css, html, LitElement } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { globalState } from "../database/temp-storage";

@customElement("sp-mobile-video-player")
export class SpMobileVideoPlayer extends LitElement {
  static styles = css`
    :host {
      position: fixed;
      display: block;
      bottom: 100px;
      z-index: 2;
      width: 100%;
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

    .title {
      font-size: 12px;
      margin: 0;
    }
  `;

  @property({ attribute: "play-item" })
  playItem = "";

  @query("#my-audio")
  private _audioPlayer: HTMLAudioElement;

  @query("#play-pause-control")
  private _toggleButton: HTMLButtonElement;

  private _togglePlay() {
    if (!this._toggleButton) {
      return;
    }
    if (this._audioPlayer?.paused) {
      this._audioPlayer?.play();
      this._toggleButton.textContent = "stahp";
    } else {
      this._audioPlayer?.pause();
      this._toggleButton.textContent = "staht";
    }
  }

  render() {
    if (!this.playItem) {
      return null;
    }

    const { feed } = globalState;
    const showToPlay = feed.items.find(({ guid }) => guid === this.playItem);
    console.log({
      feed,
      showToPlay,
    });

    const imgSrc = showToPlay.itunes.image ?? feed.image.url;

    return html`
      <div class="container">
        <img height="50" width="50" src=${imgSrc} />
        <div>
          <p class="show-title">${showToPlay.title}</p>
          <p class="title">${feed.title}</p>
        </div>
        <button id="play-pause-control" @click=${this._togglePlay}>
          stahp
        </button>
      </div>
      <audio
        id="my-audio"
        src=${showToPlay.enclosure.url}
        preload="auto"
        autoplay
      ></audio>
    `;
  }
}
