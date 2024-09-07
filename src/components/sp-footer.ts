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
          <a href="/" class=${this.getClass("/")}>Home</a>
          <a href="/about" class=${this.getClass("/about")}>About</a>
        </nav>
      </footer>
    `;
  }
}
