import { css, html, LitElement } from "lit";
import { Task } from "@lit/task";
import { customElement, property } from "lit/decorators.js";
import {
  FeedItemPlaybackRow,
  FeedItemTableRow,
  FeedTableRow,
} from "../types/database";
import { getSPDB } from "../actions/database";
import "../components/sp-feed-list";
import "../components/sp-loading-page.ts";
import { deleteFeedFromCache, fetchFeedItem } from "../actions/feed.ts";
import { FeedItemCard } from "../components/sp-feed-list-item.ts";

interface FeedItemWithFeedParent extends FeedItemTableRow {
  feed: FeedTableRow;
  feedItemPlayback: FeedItemPlaybackRow;
}

@customElement("sp-show-feed-page")
export class SpShowFeedPage extends LitElement {
  @property({ type: String })
  link: string;

  static styles = css`
    .header-and-reload-container {
      display: flex;
      justify-content: space-between;
    }
  `;

  private _getFeed = async () => {
    const feedItems = await fetchFeedItem(decodeURIComponent(this.link));
    const db = await getSPDB();
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

  private _deleteShow = async (link: string) => {
    const db = await getSPDB();
    const tx = db.transaction(["feed"], "readwrite");

    // delete feed
    const feedObjectStore = tx.objectStore("feed");
    feedObjectStore.delete(link);

    // remove feed items from cache
    deleteFeedFromCache(link);

    // tell everyone that we're done
    await tx.done;

    window.location.href = "/shows";
  };

  private _renderFeedList = (feedItems: FeedItemWithFeedParent[]) => {
    const title = feedItems.find(Boolean)?.feed.title;
    const link = feedItems.find(Boolean)?.feed.link;
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
          !feedItem.itunes.duration ||
          !feedItem.guid
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
          guid: feedItem.guid,
        };
      })
      .filter((card) => card !== null);

    return html`
      <div class="header-and-reload-container">
        <h1>${title}</h1>
        <button @click=${() => this._deleteShow(link!)}>Delete</button>
      </div>
      <sp-feed-list .feedItems=${feedItemCards}></sp-feed-list>
    `;
  };

  render() {
    return this._feedTask.render({
      pending: () => html`<sp-loading-page></sp-loading-page>`,
      complete: this._renderFeedList,
    });
  }
}
