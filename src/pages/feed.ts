import { html, LitElement } from "lit";
import { Task } from "@lit/task";
import { customElement } from "lit/decorators.js";
import { FeedItemTableRow, FeedTableRow } from "../types/database";
import { getSPDB } from "../actions/database";
import "../components/sp-feed-list";
import { FeedItemCard } from "../components/sp-feed-list";
import "../components/sp-loading-page.ts";

interface FeedItemWithFeedParent extends FeedItemTableRow {
  feed: FeedTableRow;
}

@customElement("sp-feed-page")
export class SpFeedPage extends LitElement {
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
        {} as Record<string, FeedTableRow>,
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

    return html`
      <h1>Your Feed</h1>
      <sp-feed-list .feedItems=${feedItemCards}></sp-feed-list>
    `;
  };

  render() {
    return this._feedTask.render({
      pending: () => html`<sp-loading-page></sp-loading-page>`,
      complete: this._renderFeed,
    });
  }
}
