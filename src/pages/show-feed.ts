import { css, html, LitElement } from "lit";
import { Task } from "@lit/task";
import { customElement, property, state } from "lit/decorators.js";
import { FeedItemPlaybackRow } from "../types/database";
import { getSPDB } from "../actions/database";
import "../components/sp-feed-list";
import "../components/sp-loading-page.ts";
import { deleteFeed, fetchFeed, getFeedFromCache } from "../actions/feed.ts";
import { FeedItemCard } from "../components/sp-feed-list-item.ts";
import { Feed } from "../types/rss.ts";
import { router } from "../router.ts";

@customElement("sp-show-feed-page")
export class SpShowFeedPage extends LitElement {
  @property({ type: String })
  link: string;

  @state()
  feedItemPlaybackByKey: Record<string, FeedItemPlaybackRow> | null = null;

  static styles = css`
    .header-and-reload-container {
      display: flex;
      justify-content: space-between;
    }
  `;

  private _getFeedItemPlayback = async () => {
    const db = await getSPDB();
    const feedItemPlayback = await db.getAll("feed-item-playback");

    this.feedItemPlaybackByKey = feedItemPlayback.reduce(
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
      const feed = await fetchFeed(decodeURIComponent(this.link));
      await this._getFeedItemPlayback();
      return feed;
    },
    args: () => [],
  });

  private _deleteShow = async (link: string) => {
    await deleteFeed(link);

    router.navigate("/shows");
  };

  private _renderFeedList = (feed: Feed) => {
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
          feedItemPlayback: this.feedItemPlaybackByKey
            ? this.feedItemPlaybackByKey[feedItem.enclosure!.url]
            : undefined,
          guid: feedItem.guid,
          feedUrl,
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

  connectedCallback() {
    super.connectedCallback();
    const feed = getFeedFromCache(decodeURIComponent(this.link));
    if (feed) {
      this._getFeedItemPlayback();
    }
  }

  render() {
    const feed = getFeedFromCache(decodeURIComponent(this.link));
    if (feed) {
      return this._renderFeedList(feed);
    }

    return this._feedTask.render({
      pending: () => html`<sp-loading-page></sp-loading-page>`,
      complete: this._renderFeedList,
    });
  }
}
