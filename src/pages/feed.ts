import { css, html, LitElement } from "lit";
import { Task } from "@lit/task";
import { customElement } from "lit/decorators.js";
import { FeedItemTableRow, FeedTableRow } from "../types/database";
import { getSPDB } from "../actions/database";
import "../components/sp-feed-list";
import { FeedItemCard } from "../components/sp-feed-list";
import "../components/sp-loading-page.ts";
import { addFeed } from "../actions/feed.ts";
import { Feed } from "../types/rss.ts";

interface FeedItemWithFeedParent extends FeedItemTableRow {
  feed: FeedTableRow;
}

@customElement("sp-feed-page")
export class SpFeedPage extends LitElement {
  static styles = css`
    .header-and-reload-container {
      display: flex;
      justify-content: space-between;
    }
  `;

  private _getFeed = async () => {
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
      {} as Record<string, FeedTableRow>,
    );

    return feedItems.map((feedItem) => {
      return {
        feed: feedsByKey[feedItem.feedLink],
        ...feedItem,
      };
    }) as FeedItemWithFeedParent[];
  };

  private _feedTask = new Task(this, {
    task: async () => {
      return this._getFeed();
    },
    args: () => [],
  });

  private _refreshFeedTask = new Task(this, {
    task: async () => {
      const db = await getSPDB();
      const feeds = await db.getAll("feed");
      const feedUrls = feeds
        .map((feed) => encodeURIComponent(feed.feedUrl!))
        .join(",");

      const searchParams = new URLSearchParams(`feeds=${feedUrls}`);
      const response = await fetch(`/api/fetch-feed?${searchParams}`, {
        method: "get",
      });
      const feedUpdates = await response.json();
      await Promise.all(feedUpdates.map((feed: Feed) => addFeed(feed)));
      return this._getFeed();
    },
  });

  private _renderFeedList = (feedItems: FeedItemWithFeedParent[]) => {
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

    // when we start searching, I'm gonna need a whole lotta help
    // I feel like I might need to restructure this
    return html`
      <div class="header-and-reload-container">
        <h1>Your Feed</h1>
        <button @click=${() => this._refreshFeedTask.run()}>
          Refresh Feed
        </button>
      </div>
      <div>
        <input />
      </div>
      <sp-feed-list .feedItems=${feedItemCards}></sp-feed-list>
    `;
  };

  private _renderFeed = (feedItems: FeedItemWithFeedParent[]) => {
    return this._refreshFeedTask.render({
      pending: () => html`<sp-loading-page></sp-loading-page>`,
      initial: () => this._renderFeedList(feedItems),
      complete: this._renderFeedList,
    });
  };

  render() {
    return this._feedTask.render({
      pending: () => html`<sp-loading-page></sp-loading-page>`,
      complete: this._renderFeed,
    });
  }
}
