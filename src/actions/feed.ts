import { Feed, FeedItem } from "../types/rss";
import { getSPDB } from "./database";

export interface FeedItemUgh extends Omit<FeedItem, "isoDate"> {
  feed: Omit<Feed, "items">;
  isoDate?: Date;
}

export async function addFeed(feed: Feed) {
  const db = await getSPDB();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { items, ...otherFeed } = feed;

  const tx = db.transaction(["feed"], "readwrite");
  const feedObjectStore = tx.objectStore("feed");
  await feedObjectStore.put(otherFeed);

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

  return response.json();
}
