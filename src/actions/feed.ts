import { Feed } from "../types/rss";
import { getSPDB } from "./database";

export async function addFeedToSPDB(feed: Feed) {
  const db = await getSPDB();
  const { items, ...otherFeed } = feed;

  const tx = db.transaction(["feed", "feed-item"], "readwrite");
  const feedObjectStore = tx.objectStore("feed");
  await feedObjectStore.put(otherFeed);

  const feedItemObjectStore = tx.objectStore("feed-item");
  await Promise.all(
    items.map((item) => {
      return feedItemObjectStore.put({ feedLink: otherFeed.link!, ...item });
    }),
  );

  return tx.done;
}

export async function getAllFeedItems() {
  const db = await getSPDB();
  const feedItems = await db.getAll("feed-item");
  const feeds = [...new Set(feedItems.map((feedItem) => feedItem.feedLink))];
  console.log(feeds);
  return feedItems;
}

export async function getFeed(link: string) {
  const db = await getSPDB();
  return db.get("feed", link);
}
