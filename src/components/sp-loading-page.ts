import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import "./sp-loading-spinner";

@customElement("sp-loading-page")
export class SpLoadingPage extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    div {
      display: grid;
      height: 200px;
      place-items: center;
    }
  `;

  render() {
    return html`<div><sp-loading-spinner></sp-loading-spinner></div>`;
  }
}
