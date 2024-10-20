import { css, CSSResultGroup, html, LitElement } from "lit";
import { Task } from "@lit/task";
import { customElement } from "lit/decorators.js";
import { getAllFeedItems, getFeed } from "../actions/feed";
import { openAudioPlayer } from "../actions/audio";
import dayjs from "dayjs";
import { FeedItemTableRow } from "../types/database";

@customElement("sp-feed-page")
export class SpFeedPage extends LitElement {
  static styles?: CSSResultGroup | undefined = css`
    .loading-error-container {
      display: grid;
      height: 200px;
      place-items: center;
    }

    li {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      list-style: none;
      border: 1px solid black;
      border-radius: 2px;
      height: 10rem;
      padding: 0.5rem 0.25rem;
    }

    li > h2 {
      font-size: 1.125rem;
      margin: 0;
    }

    li > p {
      flex-shrink: 2;
      margin: 0;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    li > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    li > div > date {
      margin-top: 0;
      margin-bottom: 0;
    }

    li + li {
      margin-top: 0.25rem;
    }

    ul {
      padding-left: 0;
    }
  `;

  private _feedTask = new Task(this, {
    task: async () => {
      return getAllFeedItems();
    },
    args: () => [],
  });

  private _renderLoading() {
    return html`
      <div class="loading-error-container">
        <sp-loading-spinner></sp-loading-spinner>
      </div>
    `;
  }

  private async _handlePlayClick(item: FeedItemTableRow) {
    const feed = await getFeed(item.feedLink);
    if (feed) {
      openAudioPlayer(feed, item);
    }
  }

  private _renderFeed = (feedItems: FeedItemTableRow[]) => {
    return html` <ul>
      ${feedItems.map((item) => {
        return html` <li>
          <h2>${item.title}</h2>
          <p>${item.contentSnippet}</p>
          <div>
            <date>${dayjs(item.isoDate).format("MMM D, YYYY")}</date>
            <button @click=${() => this._handlePlayClick(item)}>
              Play me somethin
            </button>
          </div>
        </li>`;
      })}
    </ul>`;
  };

  render() {
    return html`
      ${this._feedTask.render({
        pending: this._renderLoading,
        complete: this._renderFeed,
      })}
    `;
  }
}
