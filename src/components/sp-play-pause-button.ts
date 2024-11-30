import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import playIcon from "../assets/noun-play-6450372.svg";
import pauseIcon from "../assets/noun-pause-6450354.svg";

@customElement("sp-play-pause-button")
export class SpPlayPauseButton extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    button {
      border-color: black;
      border-width: 2px;
      border-radius: 50%;
      border-style: solid;
      background: none;
      color: white;
      cursor: pointer;

      width: 100%;
      aspect-ratio: 1 / 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    button:not(:focus-visible) {
      outline: none;
    }

    img {
      height: 100%;
    }
  `;

  @property({ type: Boolean })
  playing: boolean = false;

  render() {
    return html`<button>
      <img src=${this.playing ? pauseIcon : playIcon} />
    </button> `;
  }
}
