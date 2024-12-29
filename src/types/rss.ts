import RssParser from "rss-parser";

export interface ExtendedItem {
  itunes?: {
    image?: string;
    owner?: {
      name?: string;
      email?: string;
    };
    author?: string;
    summary?: string;
    explicit?: string;
    categories?: string[];
    keywords?: string[];
    duration?: string;
  };
}

export type Feed = RssParser.Output<ExtendedItem>;

export type FeedItem = ExtendedItem & RssParser.Item;
