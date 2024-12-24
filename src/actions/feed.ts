import { FeedTableRow } from "../types/database";
import { Feed, FeedItem } from "../types/rss";
import { getSPDB } from "./database";

export interface FeedItemUgh extends Omit<FeedItem, "isoDate"> {
  feed: Omit<Feed, "items">;
  isoDate?: Date;
}

export let feedCache: Feed[] | null = null;

export function getFeedFromCache(feedUrl: string | undefined) {
  return feedCache?.find((feed) => feedUrl && feed.feedUrl === feedUrl);
}

export async function addFeed(feed: Feed) {
  const db = await getSPDB();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { items, ...otherFeed } = feed;

  const tx = db.transaction(["feed"], "readwrite");
  const feedObjectStore = tx.objectStore("feed");
  await feedObjectStore.put(otherFeed);

  // update the cache
  if (feedCache === null) {
    feedCache = [feed];
  } else {
    if (getFeedFromCache(feed.link) === undefined) {
      feedCache.push(feed);
    }
  }

  return tx.done;
}

export async function fetchFeed(link: string): Promise<Feed> {
  const response = await fetch("/api/read-rss-feed", {
    method: "post",
    body: JSON.stringify({
      q: link,
    }),
  });

  if (!response.ok) {
    throw new Error("whoops");
  }

  const feed = await response.json();

  // append this to the feed cache if need be
  if (feedCache === null) {
    feedCache = [feed];
  } else {
    const feedCacheItem = feedCache.find(
      (fc) => fc.link && fc.link === feed.link,
    );

    if (feedCacheItem !== undefined) {
      feedCacheItem.items = feed.items;
    } else {
      feedCache.push(feed);
    }
  }

  return feed;
}

export async function getAllFeeds(): Promise<FeedTableRow[]> {
  const db = await getSPDB();
  const feeds = await db.getAll("feed");
  feedCache = feeds.map((feed) => ({ ...feed, items: [] }));
  return feeds;
}

export async function deleteFeed(link: string) {
  const db = await getSPDB();
  const tx = db.transaction(["feed"], "readwrite");

  // delete feed
  const feedObjectStore = tx.objectStore("feed");
  feedObjectStore.delete(link);

  // delete from cache
  if (feedCache) {
    feedCache = feedCache.filter((feed) => feed.link !== link);
  }

  // tell everyone that we're done
  return tx.done;
}
