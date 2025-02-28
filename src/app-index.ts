import { customElement } from "lit/decorators.js";

import { router } from "./router";
import { LiteDomLitElement } from "./components/lite-dom-lit-element";

@customElement("app-index")
export class AppIndex extends LiteDomLitElement {
  firstUpdated() {
    router.addEventListener("route-changed", () => {
      if ("startViewTransition" in document) {
        document.startViewTransition(() => this.requestUpdate());
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
