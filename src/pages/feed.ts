import { css, CSSResultGroup, html, LitElement, nothing } from "lit";
import { Task } from "@lit/task";
import { customElement } from "lit/decorators.js";
import { FeedItemTableRow, FeedTable } from "../types/database";
import { getSPDB } from "../actions/database";
import "../components/sp-feed-item-card";

interface FeedItemWithFeedParent extends FeedItemTableRow {
  feed: FeedTable;
}

@customElement("sp-feed-page")
export class SpFeedPage extends LitElement {
  static styles?: CSSResultGroup | undefined = css`
    .loading-error-container {
      display: grid;
      height: 200px;
      place-items: center;
    }

    ul {
      padding-left: 0;
    }
  `;

  private _feedTask = new Task(this, {
    task: async () => {
      const db = await getSPDB();
      const feedItems = await db.getAll("feed-item");
      const feeds = await db.getAll("feed");
      const feedsByKey = feeds.reduce(
        (acc, feed) => {
          return {
            [feed.link!]: feed,
            ...acc,
          };
        },
        {} as Record<string, FeedTable>,
      );

      return feedItems.map((feedItem) => {
        return {
          feed: feedsByKey[feedItem.feedLink],
          ...feedItem,
        };
      }) as FeedItemWithFeedParent[];
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

  private _renderFeed = (feedItems: FeedItemWithFeedParent[]) => {
    return html`<ul>
      ${feedItems.map((item) => {
        const imgSrc = item.itunes?.image ?? item.feed.image?.url;
        if (
          !item.title ||
          !item.contentSnippet ||
          !item.isoDate ||
          !item.feed.title ||
          !item.enclosure ||
          !imgSrc
        ) {
          return nothing;
        }

        return html`<sp-feed-item-card
          title=${item.title!}
          content-snippet=${item.contentSnippet!}
          date-added=${item.isoDate!}
          show-name=${item.feed.title!}
          img-src=${imgSrc}
          audio-src=${item.enclosure.url!}
        ></sp-feed-item-card>`;
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
