import RssParser from "rss-parser";
import { css, html, LitElement } from "lit";
import { Task } from "@lit/task";
import { customElement, property } from "lit/decorators.js";
import { FeedItemPlaybackRow } from "../types/database";
import { getSPDB } from "../actions/database";
import "../components/sp-feed-list";
import "../components/sp-loading-page.ts";
import { deleteFeedFromCache, fetchFeed } from "../actions/feed.ts";
import { FeedItemCard } from "../components/sp-feed-list-item.ts";
import { ExtendedItem } from "../types/rss.ts";

type FeedWithPlaybackInfo = RssParser.Output<
  ExtendedItem & { feedItemPlayback: FeedItemPlaybackRow }
>;

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
    const feed = await fetchFeed(decodeURIComponent(this.link));
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

    return {
      ...feed,
      items: feed.items.map((item) => {
        return {
          feedItemPlayback: feedItemPlaybackByKey[item.enclosure!.url],
          ...item,
        };
      }),
    };
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

  private _renderFeedList = (feed: FeedWithPlaybackInfo) => {
    console.log(feed);
    const { title, link } = feed;
    const feedItemCards: FeedItemCard[] = feed.items
      .map((feedItem) => {
        const imgSrc = feedItem.itunes?.image ?? feed.image?.url;
        if (
          !feedItem.title ||
          !feedItem.contentSnippet ||
          !feedItem.isoDate ||
          !title ||
          !feedItem.enclosure ||
          !feedItem.enclosure.url ||
          !imgSrc ||
          !feedItem.itunes ||
          !feedItem.itunes.duration ||
          !feedItem.guid ||
          !feedItem.isoDate
        ) {
          return null;
        }

        return {
          title: feedItem.title,
          contentSnippet: feedItem.contentSnippet,
          dateAdded: new Date(feedItem.isoDate),
          showName: title,
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
