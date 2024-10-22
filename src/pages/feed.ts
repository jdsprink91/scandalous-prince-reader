import { css, CSSResultGroup, html, LitElement } from "lit";
import { Task } from "@lit/task";
import { customElement } from "lit/decorators.js";
import { FeedItemTableRow, FeedTable } from "../types/database";
import { getSPDB } from "../actions/database";
import "../components/sp-feed-list";
import { FeedItemCard } from "../components/sp-feed-list";

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
  `;

  private _feedTask = new Task(this, {
    task: async () => {
      const db = await getSPDB();
      let feedItems = await db.getAllFromIndex("feed-item", "by-iso-date");
      feedItems = feedItems.reverse();
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
    const feedItemCards: FeedItemCard[] = feedItems
      .map((feedItem) => {
        const imgSrc = feedItem.itunes?.image ?? feedItem.feed.image?.url;
        if (
          !feedItem.title ||
          !feedItem.contentSnippet ||
          !feedItem.isoDate ||
          !feedItem.feed.title ||
          !feedItem.enclosure ||
          !imgSrc
        ) {
          return null;
        }
        return {
          title: feedItem.title,
          contentSnippet: feedItem.contentSnippet,
          dateAdded: feedItem.isoDate,
          showName: feedItem.feed.title,
          audioSrc: feedItem.enclosure.url!,
          imgSrc,
        };
      })
      .filter((card) => card !== null);

    return html`<sp-feed-list .feedItems=${feedItemCards}></sp-feed-list>`;
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
