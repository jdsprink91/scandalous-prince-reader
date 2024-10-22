import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import moustacheCat from "../assets/noun-moustache-cat-6113449.svg";

@customElement("sp-header")
export class SpHeader extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    div {
      display: flex;
      align-items: center;
    }

    p {
      font-size: 2rem;
      font-weight: 600;
      margin-left: 1rem;
    }

    nav {
      margin-left: 1rem;
    }

    nav > * + * {
      margin-left: 0.5rem;
    }
  `;

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
      <div>
        <img src=${moustacheCat} height="100" width="100" />
        <p>Scandalous Prince Reader</p>
        <nav>
          <a href="/feed" class=${this.getClass("/feed")}>Feed</a>
          <a href="/shows" class=${this.getClass("/shows")}>Shows</a>
          <a href="/about" class=${this.getClass("/about")}>About</a>
        </nav>
      </div>
    `;
  }
}
