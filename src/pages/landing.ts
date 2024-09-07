import { html } from "lit";
import { customElement } from "lit/decorators.js";
import catSvg from "../assets/noun-cat-king-5675713.svg";
import { LiteDomLitElement } from "../components/lite-dom-lit-element";

@customElement("sp-landing-page")
export class SpLandingPage extends LiteDomLitElement {
  render() {
    return html`<div class="landing-page">
      <img src=${catSvg} height="200" width="200" />
      <h1>Scandalous Prince RSS</h1>
      <nav class="landing-page__nav">
        <a class="landing-link" href="/feed">Feed</a>
        <a class="landing-link" href="/add">Add</a>
      </nav>
    </div>`;
  }
}
