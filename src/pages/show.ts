import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("sp-show")
export class SpShow extends LitElement {
  @property({ type: String })
  guid: string;

  render() {
    return html`<p>${this.guid}</p>`;
  }
}
