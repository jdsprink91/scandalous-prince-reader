import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

@customElement("sp-show-img")
export class SpShowImg extends LitElement {
  static styles = css`
    img {
      border-radius: 4px;
      object-fit: cover;
      flex-shrink: 0;
      width: 60px;
      height: 60px;
    }
  `;

  @property()
  src: string | undefined;

  render() {
    return html`<img src=${ifDefined(this.src)} loading="lazy" /> `;
  }
}
