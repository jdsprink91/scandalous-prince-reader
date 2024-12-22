import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("sp-about-page")
export class SpAboutPage extends LitElement {
  render() {
    return html`
      <h1>About</h1>
      <p>This is an podcast RSS feed reader designed to be a PWA.</p>
    `;
  }
}
