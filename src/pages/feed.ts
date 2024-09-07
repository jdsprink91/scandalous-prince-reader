import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { LiteDomLitElement } from "../components/lite-dom-lit-element";

@customElement("sp-feed-page")
export class SpFeedPage extends LiteDomLitElement {
  render() {
    return html`<p>this is the feed page</p>`;
  }
}
