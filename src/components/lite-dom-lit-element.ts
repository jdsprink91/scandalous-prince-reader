import { LitElement } from "lit";

export class LiteDomLitElement extends LitElement {
  createRenderRoot(): HTMLElement | DocumentFragment {
    return this;
  }
}
