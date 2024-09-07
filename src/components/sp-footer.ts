import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LiteDomLitElement } from "./lite-dom-lit-element";

@customElement("sp-footer")
export class SpFooter extends LiteDomLitElement {
  @property({ type: String })
  pathname: string = "";

  private getClass(url: string) {
    if (this.pathname === url) {
      return "active";
    }

    return "";
  }

  render() {
    return html`
      <footer>
        <nav>
          <a href="/feed" class=${this.getClass("/feed")}>Feed</a>
          <a href="/add" class=${this.getClass("/add")}>Add</a>
        </nav>
      </footer>
    `;
  }
}
