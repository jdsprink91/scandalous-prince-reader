import { Feed, FeedItem } from "../types/rss";
import { getSPDB } from "./database";

export interface FeedItemUgh extends Omit<FeedItem, "isoDate"> {
  feed: Omit<Feed, "items">;
  isoDate?: Date;
}

let cachedFeedItems: FeedItemUgh[] | null = null;

function transformFeedIntoFeedItemUgh(feed: Feed): FeedItemUgh[] {
  const { items, ...restFeed } = feed;
  return items.map((item) => {
    const { isoDate, ...restItem } = item;
    return {
      feed: restFeed,
      isoDate: isoDate ? new Date(isoDate) : undefined,
      ...restItem,
    };
  });
}

function sortFeedItemUghs(left: FeedItemUgh, right: FeedItemUgh) {
  if (left.isoDate && right.isoDate) {
    return left.isoDate < right.isoDate ? 1 : -1;
  }

  return 0;
}

export async function addFeed(feed: Feed) {
  const db = await getSPDB();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { items, ...otherFeed } = feed;

  const tx = db.transaction(["feed"], "readwrite");
  const feedObjectStore = tx.objectStore("feed");
  await feedObjectStore.put(otherFeed);

  const feedItemUghs = transformFeedIntoFeedItemUgh(feed);
  cachedFeedItems = (cachedFeedItems || [])
    .concat(feedItemUghs)
    .sort(sortFeedItemUghs);

  return tx.done;
}

export async function fetchFeedItems(): Promise<FeedItemUgh[]> {
  if (cachedFeedItems) {
    return cachedFeedItems;
  }

  const db = await getSPDB();
  const feeds = await db.getAll("feed");
  const feedUrls = feeds
    .map((feed) => encodeURIComponent(feed.feedUrl!))
    .join(",");

  const searchParams = new URLSearchParams(`feeds=${feedUrls}`);
  const response = await fetch(`/api/fetch-feed?${searchParams}`, {
    method: "get",
  });

  const feedResponse: Feed[] = await response.json();
  const feedItems = feedResponse
    .flatMap(transformFeedIntoFeedItemUgh)
    .sort(sortFeedItemUghs);

  cachedFeedItems = feedItems;
  return cachedFeedItems;
}

export function bustFeedItemCache() {
  cachedFeedItems = null;
}

export function deleteFeedFromCache(feedLink: string | undefined) {
  if (!cachedFeedItems) {
    return 0;
  }

  cachedFeedItems = cachedFeedItems.filter((item) => {
    return item.feed.link !== feedLink;
  });

  return true;
}
