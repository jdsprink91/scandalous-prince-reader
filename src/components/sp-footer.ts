import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("sp-footer")
export class SpFooter extends LitElement {
  createRenderRoot(): HTMLElement | DocumentFragment {
    return this;
  }

  render() {
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
