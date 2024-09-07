import { html } from "lit";
import { customElement } from "lit/decorators.js";
import "../components/sp-footer";
import { LiteDomLitElement } from "../components/lite-dom-lit-element";

@customElement("sp-about-page")
export class SpAboutPage extends LiteDomLitElement {
  render() {
    return html`<p>this is an about page</p>`;
  }
}
