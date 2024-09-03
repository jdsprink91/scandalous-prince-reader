import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("sp-footer")
export class SpFooter extends LitElement {
  protected render(): unknown {
    return html`
      <footer>
        <nav>
          <a href="/">Home</a>
          <a href="/about">About</a>
        </nav>
      </footer>
    `;
  }
}
