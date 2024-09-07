import { html } from "lit";
import { customElement } from "lit/decorators.js";
import "../components/sp-footer";
import { LiteDomLitElement } from "../components/lite-dom-lit-element";

@customElement("sp-add-page")
export class SpAddPage extends LiteDomLitElement {
  render() {
    return html`<p>this is where you can add a feed</p>`;
  }
}
