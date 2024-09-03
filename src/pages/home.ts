import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("sp-home-page")
export class SpHomePage extends LitElement {
  createRenderRoot(): HTMLElement | DocumentFragment {
    return this;
  }

  render() {
    return html`<p>this is a home page</p>`;
  }
}
