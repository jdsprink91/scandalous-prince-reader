import { DBSchema } from "idb";
import { Feed, FeedItem } from "./rss";

export type FeedTableRow = Omit<Feed, "items">;

export interface FeedItemTableRow extends Omit<FeedItem, "isoDate"> {
  feedLink: string;
  isoDate?: Date;
}

interface FeedItemPlaybackRow {
  feedLink: string;
  feedItemGuid: string;
  played: boolean;
  duration: number;
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
      "by-feed-link": string;
      "by-feed-item-guid": string;
    };
  };
}
