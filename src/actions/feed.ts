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

export async function getAllFeeds() {
  const db = await getSPDB();
  return db.getAll("feed");
}
