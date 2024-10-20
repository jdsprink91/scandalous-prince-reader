import { DBSchema } from "idb";
import { Feed, FeedItem } from "./rss";

type FeedTable = Omit<Feed, "items">;

interface FeedItemTable extends FeedItem {
  feedLink: string;
}

interface FeedItemPlayback {
  feedItemGuid: string;
  played: boolean;
  duration: number;
}

export interface SPDB extends DBSchema {
  feed: {
    key: string;
    value: FeedTable;
  };
  "feed-item": {
    key: string;
    value: FeedItemTable;
  };
  "feed-item-playback": {
    key: string;
    value: FeedItemPlayback;
  };
}
