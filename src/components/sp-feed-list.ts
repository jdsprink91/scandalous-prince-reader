import { css, CSSResultGroup, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import "../components/sp-show-img";
import { FeedItemCard } from "./sp-feed-list-item";

@customElement("sp-feed-list")
export class SpFeedList extends LitElement {
  static styles?: CSSResultGroup | undefined = css`
    :host {
      display: block;
    }

    ul {
      padding-left: 0;
    }

    li {
      list-style: none;
    }

    li + li {
      padding-top: 0.75rem;
      border-top: 1px solid black;
    }
  `;

  @property({ type: Array, attribute: "feed-items" })
  feedItems: FeedItemCard[] = [];

  render() {
    return html` <ul>
      ${this.feedItems.map((feedItem) => {
        return html`
          <li>
            <sp-feed-list-item .feedItem=${feedItem}></sp-feed-list-item>
          </li>
        `;
      })}
    </ul>`;
  }
}
