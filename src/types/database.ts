import { DBSchema } from "idb";
import { Feed, FeedItem } from "./rss";

export type FeedTableRow = Omit<Feed, "items">;

export interface FeedItemTableRow extends Omit<FeedItem, "isoDate"> {
  feedLink: string;
  isoDate?: Date;
}

export interface FeedItemPlaybackRow {
  url: string;
  played: boolean;
  currentTime: number;
}

export interface SPDB extends DBSchema {
  feed: {
    key: string;
    value: FeedTableRow;
  };
  "feed-item": {
    key: string;
    value: FeedItemTableRow;
    indexes: {
      "by-iso-date": Date;
      "by-feed-link": string;
    };
  };
  "feed-item-playback": {
    key: string;
    value: FeedItemPlaybackRow;
    indexes: {
      url: string;
    };
  };
}
