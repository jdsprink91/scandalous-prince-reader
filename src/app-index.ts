import { LitElement } from "lit";
import { customElement } from "lit/decorators.js";

import { router } from "./router";

@customElement("app-index")
export class AppIndex extends LitElement {
  createRenderRoot(): HTMLElement | DocumentFragment {
    return this;
  }

  firstUpdated() {
    router.addEventListener("route-changed", () => {
      if ("startViewTransition" in document) {
        (document as any).startViewTransition(() => this.requestUpdate());
      } else {
        this.requestUpdate();
      }
    });
  }

  render() {
    // router config can be round in src/router.ts
    return router.render();
  }
}
