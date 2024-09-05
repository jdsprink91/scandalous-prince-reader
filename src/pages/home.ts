import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import catSvg from "../assets/noun-cat-king-5675713.svg";

@customElement("sp-home-page")
export class SpHomePage extends LitElement {
  createRenderRoot(): HTMLElement | DocumentFragment {
    return this;
  }

  render() {
    return html`<p>this is a home page</p>
      <img src=${catSvg} height="200" width="200" />`;
  }
}
