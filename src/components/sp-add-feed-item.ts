import { css, CSSResultGroup, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Feed } from "../types/rss";
import { Task } from "@lit/task";
import { addFeed } from "../actions/feed";
import { ifDefined } from "lit/directives/if-defined.js";

@customElement("sp-add-feed-item")
export class SpAddFeedItem extends LitElement {
  static styles?: CSSResultGroup | undefined = css`
    .podcast-info-container {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      margin-top: 1rem;
    }

    .action-container {
      margin-left: auto;
      min-width: max-content;
    }
  `;

  @property({ type: Object })
  private feed: Feed;

  private _addFeed = new Task(this, {
    task: async ([feed]: [Feed]) => {
      return addFeed(feed);
    },
  });

  render() {
    return html`
      <div class="podcast-info-container">
        <img heigh="100" width="100" src="${ifDefined(this.feed.image?.url)}"></img>
        <div>
          <p>${this.feed.title}</p>
          <p>${this.feed.description}</p>
        </div>
        <div class="action-container">
          ${this._addFeed.render({
            initial: () => html`
              <button @click=${() => this._addFeed.run([this.feed])}>
                Add Feed
              </button>
            `,
            complete: () => {
              return html`<p>Added!</p>`;
            },
          })}
        </div>
      </div>
    `;
  }
}
