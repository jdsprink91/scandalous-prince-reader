import { Feed } from "../types/rss";
import { getSPDB } from "./database";

export async function addFeed(feed: Feed) {
  const db = await getSPDB();
  const { items, ...otherFeed } = feed;

  const tx = db.transaction(["feed", "feed-item"], "readwrite");
  const feedObjectStore = tx.objectStore("feed");
  await feedObjectStore.put(otherFeed);

  const feedItemObjectStore = tx.objectStore("feed-item");
  await Promise.all(
    items.map((item) => {
      const { isoDate, ...restItem } = item;

      return feedItemObjectStore.put({
        feedLink: otherFeed.link!,
        isoDate: isoDate ? new Date(isoDate) : undefined,
        ...restItem,
      });
    }),
  );

  return tx.done;
}
