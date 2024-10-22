import { html } from "lit";
import { customElement } from "lit/decorators.js";
import moustacheCat from "../assets/noun-moustache-cat-6113449.svg";
import { LiteDomLitElement } from "../components/lite-dom-lit-element";

@customElement("sp-landing-page")
export class SpLandingPage extends LiteDomLitElement {
  render() {
    return html`<div class="landing-page">
      <img src=${moustacheCat} height="200" width="200" />
      <h1>Scandalous Prince RSS</h1>
      <nav class="landing-page__nav">
        <a class="landing-link" href="/feed">Feed</a>
        <a class="landing-link" href="/shows">Shows</a>
      </nav>
    </div>`;
  }
}
