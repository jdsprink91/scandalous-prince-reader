import { html } from "lit";
import { customElement } from "lit/decorators.js";
import catSvg from "../assets/noun-cat-king-5675713.svg";
import { LiteDomLitElement } from "../components/lite-dom-lit-element";

@customElement("sp-home-page")
export class SpHomePage extends LiteDomLitElement {
  render() {
    return html`<p>this is a home page</p>
      <img src=${catSvg} height="200" width="200" />`;
  }
}
