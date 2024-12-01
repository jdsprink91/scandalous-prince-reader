import { css, html, LitElement } from "lit";
import { Task } from "@lit/task";
import { customElement } from "lit/decorators.js";
import {
  FeedItemPlaybackRow,
  FeedItemTableRow,
  FeedTableRow,
} from "../types/database";
import { getSPDB } from "../actions/database";
import "../components/sp-feed-list";
import "../components/sp-loading-page.ts";
import { bustFeedItemCache, fetchFeedItems } from "../actions/feed.ts";
import { FeedItemCard } from "../components/sp-feed-list-item.ts";

interface FeedItemWithFeedParent extends FeedItemTableRow {
  feed: FeedTableRow;
  feedItemPlayback: FeedItemPlaybackRow;
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
    const feedItems = await fetchFeedItems();
    const feedItemPlayback = await db.getAll("feed-item-playback");

    const feedItemPlaybackByKey = feedItemPlayback.reduce(
      (acc, feedItemPlayback) => {
        return {
          [feedItemPlayback.url]: feedItemPlayback,
          ...acc,
        };
      },
      {} as Record<string, FeedItemPlaybackRow>,
    );

    return feedItems.map((feedItem) => {
      return {
        feedItemPlayback: feedItemPlaybackByKey[feedItem.enclosure!.url],
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
      bustFeedItemCache();
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
          !feedItem.enclosure.url ||
          !imgSrc ||
          !feedItem.itunes ||
          !feedItem.itunes.duration
        ) {
          return null;
        }

        return {
          title: feedItem.title,
          contentSnippet: feedItem.contentSnippet,
          dateAdded: feedItem.isoDate,
          showName: feedItem.feed.title,
          audioSrc: feedItem.enclosure.url,
          duration: feedItem.itunes.duration,
          imgSrc,
          feedItemPlayback: feedItem.feedItemPlayback,
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
