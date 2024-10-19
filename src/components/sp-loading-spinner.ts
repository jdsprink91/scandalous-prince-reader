import { css, CSSResultGroup, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("sp-loading-spinner")
export class SpLoadingSpinner extends LitElement {
  static styles?: CSSResultGroup | undefined = css`
    @keyframes rotate-forever {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }

    .loading-spinner {
      animation-duration: 0.75s;
      animation-iteration-count: infinite;
      animation-name: rotate-forever;
      animation-timing-function: linear;
      height: 30px;
      width: 30px;
      border: 8px solid black;
      border-right-color: transparent;
      border-radius: 50%;
    }
  `;

  render() {
    return html` <div class="loading-spinner"></div> `;
  }
}
