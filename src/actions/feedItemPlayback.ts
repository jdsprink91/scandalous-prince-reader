import { FeedItemPlaybackRow } from "../types/database";
import { getSPDB } from "./database";

export async function updateFeedItemPlayback(
  feedItemPlaybackRow: FeedItemPlaybackRow,
) {
  const db = await getSPDB();
  const tx = db.transaction("feed-item-playback", "readwrite");
  const feedItemPlaybackStore = tx.objectStore("feed-item-playback");
  feedItemPlaybackStore.put(feedItemPlaybackRow);
  await tx.done;
}
