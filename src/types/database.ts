import { DBSchema } from "idb";
import { Feed, FeedItem } from "./rss";

export type FeedTable = Omit<Feed, "items">;

export interface FeedItemTableRow extends Omit<FeedItem, "isoDate"> {
  feedLink: string;
  isoDate?: Date;
}

interface FeedItemPlaybackRow {
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
    value: FeedItemTableRow;
    indexes: {
      "by-iso-date": Date;
    };
  };
  "feed-item-playback": {
    key: string;
    value: FeedItemPlaybackRow;
  };
}
