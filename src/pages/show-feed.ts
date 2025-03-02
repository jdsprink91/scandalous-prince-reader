import { css, html, LitElement } from "lit";
import { Task } from "@lit/task";
import { customElement, property } from "lit/decorators.js";
import { FeedItemPlaybackRow } from "../types/database";
import { getSPDB } from "../actions/database";
import "../components/sp-feed-list";
import "../components/sp-loading-page.ts";
import {
  deleteFeed,
  fetchFeed,
  getFeedFromCache,
  removeFeedFromCache,
} from "../actions/feed.ts";
import { FeedItemCard } from "../components/sp-feed-list-item.ts";
import { Feed } from "../types/rss.ts";
import { router } from "../router.ts";

@customElement("sp-show-feed-page")
export class SpShowFeedPage extends LitElement {
  @property({ type: String })
  link: string;

  static styles = css`
    .header-container {
      display: flex;
      justify-content: space-between;
    }

    .action-container {
      display: flex;
    }

    .action-container > button:first-child {
      margin-inline-start: auto;
    }

    .action-container > button:last-child {
      margin-inline-start: 0.5rem;
    }
  `;

  private _getFeedItemPlayback = async () => {
    const db = await getSPDB();
    const feedItemPlayback = await db.getAll("feed-item-playback");

    return feedItemPlayback.reduce(
      (acc, feedItemPlayback) => {
        return {
          [feedItemPlayback.url]: feedItemPlayback,
          ...acc,
        };
      },
      {} as Record<string, FeedItemPlaybackRow>,
    );
  };

  private _feedTask = new Task(this, {
    task: async () => {
      const decodedLink = decodeURIComponent(this.link);
      let feed = getFeedFromCache(decodedLink);
      if (feed === undefined || feed.items.length === 0) {
        feed = await fetchFeed(decodedLink);
      }
      const feedItemPlayback = await this._getFeedItemPlayback();
      return {
        feed,
        feedItemPlayback,
      };
    },
    args: () => [],
  });

  private _refreshShow = async () => {
    removeFeedFromCache(decodeURIComponent(this.link));

    this._feedTask.run();
  };

  private _deleteShow = async (link: string) => {
    await deleteFeed(link);

    router.navigate("/shows");
  };

  private _renderFeedList = ({
    feed,
    feedItemPlayback,
  }: {
    feed: Feed;
    feedItemPlayback: Record<string, FeedItemPlaybackRow>;
  }) => {
    const { title, link, feedUrl } = feed;
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
          !feedItem.isoDate ||
          !feedUrl
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
          feedItemPlayback: feedItemPlayback
            ? feedItemPlayback[feedItem.enclosure!.url]
            : undefined,
          guid: feedItem.guid,
          feedUrl,
        };
      })
      .filter((card) => card !== null);

    return html`
      <div class="header-container">
        <h1>${title}</h1>
      </div>
      <div class="action-container">
        <button @click=${this._refreshShow}>Refresh</button>
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
