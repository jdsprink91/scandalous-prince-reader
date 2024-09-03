import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import "../components/sp-footer";

@customElement("sp-about-page")
export class SpAboutPage extends LitElement {
  createRenderRoot(): HTMLElement | DocumentFragment {
    return this;
  }

  render() {
    return html`<p>this is an about page</p>`;
  }
}
