import { IDBPDatabase, openDB } from "idb";
import { SPDB } from "../types/database";

let spdb: IDBPDatabase<SPDB> | null = null;

export async function getSPDB(): Promise<IDBPDatabase<SPDB>> {
  if (spdb === null) {
    spdb = await openDB<SPDB>("sp-db", 1, {
      upgrade(db) {
        db.createObjectStore("feed", { keyPath: "link" });
        const feedItemStore = db.createObjectStore("feed-item", {
          keyPath: "guid",
        });
        feedItemStore.createIndex("by-iso-date", "isoDate");
        feedItemStore.createIndex("by-feed-link", "feedLink");

        const feedItemGuid = db.createObjectStore("feed-item-playback", {
          keyPath: "feedItemGuid",
        });
        feedItemGuid.createIndex("by-feed-item-guid", "feedItemGuid");
        feedItemGuid.createIndex("by-feed-link", "feedLink");
      },
    });
  }

  return spdb;
}
